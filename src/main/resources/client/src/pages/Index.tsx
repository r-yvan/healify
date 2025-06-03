
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Calendar, Users, Shield, ArrowRight, Star, Clock, CheckCircle } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Book appointments with your preferred doctors in just a few clicks',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Find Specialists',
      description: 'Search for doctors by specialization and location to find the right care',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your health information is protected with enterprise-grade security',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Happy Patients' },
    { value: '500+', label: 'Qualified Doctors' },
    { value: '24/7', label: 'Support Available' },
    { value: '99%', label: 'Success Rate' }
  ];
  console.log(user.role)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Enhanced Header */}
      <header className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg mr-3">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">HealFlow</h1>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white">Welcome, {user?.name}</span>
                  <Link to={user?.role === 'DOCTOR' ? '/doctor/dashboard' : '/patient/dashboard'}>
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
                      Go to Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login">
                    <Button variant="ghost" className="text-white hover:text-blue-400 hover:bg-blue-400/10">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30 text-blue-300 text-sm font-medium mb-6">
              <Star className="h-4 w-4 mr-2" />
              Trusted by thousands of patients
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Your Health,{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Simplified
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Connect with qualified healthcare professionals, book appointments seamlessly, 
            and manage your health journey with our intuitive patient portal.
          </p>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-lg px-8 py-4 font-medium">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-gray-600 text-white hover:bg-gray-800 font-medium">
                  Sign In
                </Button>
              </Link>
            </div>
          )}

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Why Choose HealFlow?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience healthcare the modern way with our comprehensive patient portal
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 text-center hover:border-blue-500/30 transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-6">
                    <div className={`bg-gradient-to-r ${feature.color} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              How HealFlow Works
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Healthcare management has never been easier
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center px-4">
              <div className="bg-blue-500/20 p-4 rounded-full mb-6 w-16 h-16 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1. Find a Specialist</h3>
              <p className="text-gray-400">Search for doctors by specialization, location, or availability to find the perfect match for your needs.</p>
            </div>
            
            <div className="flex flex-col items-center text-center px-4">
              <div className="bg-purple-500/20 p-4 rounded-full mb-6 w-16 h-16 flex items-center justify-center">
                <Clock className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">2. Book Your Appointment</h3>
              <p className="text-gray-400">Select a convenient time slot and book your appointment with just a few clicks. No phone calls needed.</p>
            </div>
            
            <div className="flex flex-col items-center text-center px-4">
              <div className="bg-green-500/20 p-4 rounded-full mb-6 w-16 h-16 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">3. Get Quality Care</h3>
              <p className="text-gray-400">Visit your doctor at the scheduled time and receive the care you need. Follow-ups are just as easy to arrange.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of patients and healthcare providers using HealFlow
          </p>
          {!isAuthenticated && (
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-lg px-8 py-4 font-medium">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800/90 border-t border-gray-700/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="flex items-center mb-6 md:mb-0">
              <Stethoscope className="h-8 w-8 text-blue-500 mr-3" />
              <span className="text-white text-xl font-semibold">HealFlow</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Testimonials</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 HealFlow. All rights reserved. Built with care for better healthcare.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
