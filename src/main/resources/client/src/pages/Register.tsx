import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { toast } from "@/hooks/use-toast";
import { Stethoscope } from "lucide-react";
import { authAPI } from "@/services/api";

const registerSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: Yup.string().oneOf(["PATIENT", "DOCTOR"]).required("Role is required"),
  specialization: Yup.string().when("role", {
    is: "DOCTOR",
    then: (schema) => schema.required("Specialization is required for doctors"),
  }),
  location: Yup.string().when("role", {
    is: "DOCTOR",
    then: (schema) => schema.required("Location is required for doctors"),
  }),
});

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      // Call the registration API
      const response = await authAPI.register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        specialization:
          values.role === "DOCTOR" ? values.specialization : undefined,
        location: values.role === "DOCTOR" ? values.location : undefined,
      });

      // Store the token
      localStorage.setItem("token", response.token);

      // Call the register function from auth context
      // await register(values);

      toast({
        title: "Success",
        description: "Account created successfully!",
      });

      if (values.role === "DOCTOR") {
        navigate("/doctor/dashboard");
      } else {
        navigate("/patient/dashboard");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-8">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Stethoscope className="h-12 w-12 text-blue-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Join HealFlow
          </CardTitle>
          <CardDescription className="text-gray-400">
            Create your account
          </CardDescription>
        </CardHeader>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            role: "",
            specialization: "",
            location: "",
          }}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Full Name
                  </Label>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-400 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-400 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-400 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Role</Label>
                  <Select
                    onValueChange={(value) => setFieldValue("role", value)}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="PATIENT">Patient</SelectItem>
                      <SelectItem value="DOCTOR">Doctor</SelectItem>
                    </SelectContent>
                  </Select>
                  <ErrorMessage
                    name="role"
                    component="div"
                    className="text-red-400 text-sm"
                  />
                </div>

                {values.role === "DOCTOR" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="specialization" className="text-white">
                        Specialization
                      </Label>
                      <Field
                        as={Input}
                        id="specialization"
                        name="specialization"
                        placeholder="e.g., Cardiology, Dermatology"
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                      <ErrorMessage
                        name="specialization"
                        component="div"
                        className="text-red-400 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-white">
                        Location
                      </Label>
                      <Field
                        as={Input}
                        id="location"
                        name="location"
                        placeholder="e.g., New York, NY"
                        className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                      <ErrorMessage
                        name="location"
                        component="div"
                        className="text-red-400 text-sm"
                      />
                    </div>
                  </>
                )}
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>

                <p className="text-center text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default Register;
