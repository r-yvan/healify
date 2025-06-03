
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { doctorAPI } from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Calendar, Clock, MapPin, User, LogOut, Stethoscope, Check, X, TrendingUp, Users, ClipboardList } from 'lucide-react';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  const { data: appointments, isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => doctorAPI.getAppointments(user?.email || ''),
  });

  const respondToAppointmentMutation = useMutation({
    mutationFn: ({ id, accept }: { id: number; accept: boolean }) => 
      doctorAPI.respondToAppointment(id, accept, user?.email || ''),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Appointment response sent successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to respond to appointment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAppointmentResponse = (id: number, accept: boolean) => {
    respondToAppointmentMutation.mutate({ id, accept });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pending</Badge>;
      case 'ACCEPTED':
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Accepted</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingCount = appointments?.filter((apt: any) => apt.status === 'PENDING').length || 0;
  const acceptedCount = appointments?.filter((apt: any) => apt.status === 'ACCEPTED').length || 0;
  const totalCount = appointments?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Enhanced Header */}
      <header className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                <Stethoscope className="h-6 w-6 text-blue-400" />
              </div>
              <h1 className="text-xl font-bold text-white">HealFlow</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-white bg-gray-700/50 px-3 py-2 rounded-lg">
                <User className="h-4 w-4 mr-2 text-blue-400" />
                <span className="text-sm font-medium">Dr. {user?.name}</span>
              </div>
              <Button 
                variant="ghost" 
                onClick={logout}
                className="text-white hover:text-red-400 hover:bg-red-400/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 border border-blue-500/20">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome, Dr. {user?.name}</h2>
            <p className="text-gray-300">Manage your appointments and patient schedule</p>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-300">Total Appointments</p>
                  <p className="text-3xl font-bold text-white">{totalCount}</p>
                </div>
                <ClipboardList className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-600/20 to-yellow-700/20 border-yellow-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-300">Pending</p>
                  <p className="text-3xl font-bold text-white">{pendingCount}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-600/20 to-green-700/20 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-300">Accepted</p>
                  <p className="text-3xl font-bold text-white">{acceptedCount}</p>
                </div>
                <Check className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-300">Success Rate</p>
                  <p className="text-3xl font-bold text-white">{totalCount > 0 ? Math.round((acceptedCount / totalCount) * 100) : 0}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Appointments List */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white mb-6">Appointment Requests</h3>
          
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="bg-gray-800/50 border-gray-700/50 animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
                      <div>
                        <div className="h-4 bg-gray-700 rounded mb-2 w-32"></div>
                        <div className="h-3 bg-gray-700 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-700 rounded w-20"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="h-3 bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-700 rounded"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-700 rounded w-20"></div>
                    <div className="h-8 bg-gray-700 rounded w-20"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : appointments?.length > 0 ? (
            appointments.map((appointment: any) => (
              <Card key={appointment.id} className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {appointment.patientName?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">
                          {appointment.patientName}
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          Appointment ID: #{appointment.id}
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-300 bg-gray-700/30 p-3 rounded-lg">
                      <Clock className="h-5 w-5 mr-3 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-400">Date & Time</p>
                        <p className="font-medium">{formatDateTime(appointment.appointmentTime)}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-300 bg-gray-700/30 p-3 rounded-lg">
                      <MapPin className="h-5 w-5 mr-3 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-400">Location</p>
                        <p className="font-medium">{appointment.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  {appointment.status === 'PENDING' && (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleAppointmentResponse(appointment.id, true)}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-medium"
                        disabled={respondToAppointmentMutation.isPending}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleAppointmentResponse(appointment.id, false)}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-medium"
                        disabled={respondToAppointmentMutation.isPending}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardContent className="p-12 text-center">
                <Calendar className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No appointments yet</h3>
                <p className="text-gray-400">Your appointment requests will appear here</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
