import React, { useState, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useAuth } from "../contexts/AuthContext";
import { patientAPI } from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Stethoscope,
  User,
  LogOut,
  Star,
  Filter,
} from "lucide-react";

const appointmentSchema = Yup.object().shape({
  appointmentTime: Yup.string().required("Appointment time is required"),
  location: Yup.string().required("Location is required"),
});

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <Card className="w-full max-w-md bg-gray-800 border-red-500">
      <CardHeader>
        <CardTitle className="text-red-500">Error</CardTitle>
        <CardDescription>{error.message}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </CardContent>
    </Card>
  </div>
);

const PatientDashboard = () => {
  console.log("Rendering PatientDashboard");
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [searchFilters, setSearchFilters] = useState({
    specialization: "",
    location: "",
  });
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  console.log("Current user:", user);

  const {
    data: doctors,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["doctors", searchFilters],
    queryFn: () =>
      patientAPI.getDoctors(
        searchFilters.specialization,
        searchFilters.location
      ),
  });

  const bookAppointmentMutation = useMutation({
    mutationFn: (appointmentData: any) =>
      patientAPI.bookAppointment(user?.email || "", appointmentData),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Appointment booked successfully!",
      });
      setIsBookingOpen(false);
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = (filters: {
    specialization: string;
    location: string;
  }) => {
    setSearchFilters(filters);
  };

  const handleBookAppointment = (values: any) => {
    if (selectedDoctor) {
      bookAppointmentMutation.mutate({
        doctorId: selectedDoctor.id,
        appointmentTime: values.appointmentTime,
        location: values.location,
      });
    }
  };

  if (error) {
    console.error("Error fetching doctors:", error);
    return <ErrorFallback error={error as Error} />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
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
                  <span className="text-sm font-medium">{user?.name}</span>
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
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user?.name}!
              </h2>
              <p className="text-gray-300">
                Find and book appointments with qualified healthcare
                professionals
              </p>
            </div>
          </div>

          {/* Enhanced Search Filters */}
          <Card className="mb-8 bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Filter className="h-5 w-5 mr-2 text-blue-400" />
                Find Your Doctor
              </CardTitle>
              <CardDescription className="text-gray-400">
                Search by specialization and location to find the perfect
                healthcare provider
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={{ specialization: "", location: "" }}
                onSubmit={handleSearch}
              >
                {({ setFieldValue, values }) => (
                  <Form className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-white text-sm font-medium mb-2 block">
                        Specialization
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setFieldValue("specialization", value)
                        }
                      >
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                          <SelectValue placeholder="All Specializations" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="all">
                            All Specializations
                          </SelectItem>
                          <SelectItem value="Cardiology">Cardiology</SelectItem>
                          <SelectItem value="Dermatology">
                            Dermatology
                          </SelectItem>
                          <SelectItem value="Neurology">Neurology</SelectItem>
                          <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="Orthopedics">
                            Orthopedics
                          </SelectItem>
                          <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                          <SelectItem value="Oncology">Oncology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white text-sm font-medium mb-2 block">
                        Location
                      </Label>
                      <Field
                        as={Input}
                        name="location"
                        placeholder="Enter city or area"
                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Search Doctors
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>

          {/* Enhanced Doctors Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card
                  key={i}
                  className="bg-gray-800/50 border-gray-700/50 animate-pulse"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 bg-gray-700 rounded-full mr-4"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-700 rounded mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-700 rounded"></div>
                      <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                    </div>
                    <div className="h-10 bg-gray-700 rounded mt-4"></div>
                  </CardContent>
                </Card>
              ))
            ) : doctors?.length > 0 ? (
              doctors.map((doctor: any) => (
                <Card
                  key={doctor.id}
                  className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                        {doctor.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          Dr. {doctor.name}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="bg-blue-500/20 text-blue-300 border-blue-500/30"
                        >
                          {doctor.specialization}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-300 text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-blue-400" />
                        <span>{doctor.location}</span>
                      </div>
                      <div className="flex items-center text-gray-300 text-sm">
                        <Star className="h-4 w-4 mr-2 text-yellow-400" />
                        <span>Highly Rated</span>
                      </div>
                    </div>

                    <Dialog
                      open={isBookingOpen}
                      onOpenChange={setIsBookingOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium"
                          onClick={() => setSelectedDoctor(doctor)}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Appointment
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-800 border-gray-700 text-white">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold">
                            Book Appointment
                          </DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Schedule your appointment with Dr.{" "}
                            {selectedDoctor?.name}
                          </DialogDescription>
                        </DialogHeader>

                        <Formik
                          initialValues={{ appointmentTime: "", location: "" }}
                          validationSchema={appointmentSchema}
                          onSubmit={handleBookAppointment}
                        >
                          <Form className="space-y-6">
                            <div>
                              <Label className="text-white font-medium">
                                Appointment Date & Time
                              </Label>
                              <Field
                                as={Input}
                                name="appointmentTime"
                                type="datetime-local"
                                className="bg-gray-700/50 border-gray-600 text-white mt-2"
                              />
                            </div>
                            <div>
                              <Label className="text-white font-medium">
                                Preferred Location
                              </Label>
                              <Field
                                as={Input}
                                name="location"
                                placeholder="Enter preferred location"
                                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 mt-2"
                              />
                            </div>
                            <Button
                              type="submit"
                              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium"
                              disabled={bookAppointmentMutation.isPending}
                            >
                              {bookAppointmentMutation.isPending ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Booking...
                                </>
                              ) : (
                                <>
                                  <Clock className="h-4 w-4 mr-2" />
                                  Confirm Booking
                                </>
                              )}
                            </Button>
                          </Form>
                        </Formik>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <Card className="bg-gray-800/50 border-gray-700/50">
                  <CardContent className="p-12 text-center">
                    <Stethoscope className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No doctors found
                    </h3>
                    <p className="text-gray-400">
                      Try adjusting your search criteria or browse all doctors
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default PatientDashboard;
