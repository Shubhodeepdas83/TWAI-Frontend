'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from "next-auth/react";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      // Use NextAuth signIn method with Google provider
      await signIn('google', {
        callbackUrl: '/welcome',
        redirect: true,
      });
      // Note: We don't need to manually set isLoading to false or navigate
      // as NextAuth will handle the redirect after successful authentication
    } catch (error) {
      console.error('Google signup error:', error);
      setIsLoading(false);
    }
  };

  const jarwiz = {
    50: '#f0f7ff',
    100: '#e0eefe',
    200: '#bae0fe',
    300: '#7ac7fd',
    400: '#36a9fa',
    500: '#0c8eeb',
    600: '#0070cc',
    700: '#0058a6',
    800: '#064b87',
    900: '#0b3e6f',
    950: '#082649',
  };

  const accentColor = 'hsl(var(--accent))';

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'hsl(var(--background))' }}>
      <header className="fixed top-0 left-0 right-0 z-50 py-2" style={{ backgroundColor: '#000000' }}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-extrabold" style={{ textDecoration: 'none' }}>
              <span style={{ color: jarwiz[600] }}>Jar</span>
              <span style={{ color: jarwiz[500] }}>wiz</span>
              <span style={{ color: accentColor, fontWeight: 'bold' }}>AI</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4" style={{ background: `linear-gradient(to bottom, #0c0d10, #111826)` }}>
        <div className="w-full max-w-md">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl" style={{ borderColor: 'hsl(var(--border))' }}>
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(to right, ${jarwiz[600]}, ${accentColor}, ${jarwiz[500]})` }}></div>
            <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: `linear-gradient(to right, ${jarwiz[500]}, ${accentColor}, ${jarwiz[600]})` }}></div>
            <div className="absolute top-0 left-0 bottom-0 w-1" style={{ background: `linear-gradient(to bottom, ${jarwiz[600]}, ${accentColor}, ${jarwiz[500]})` }}></div>
            <div className="absolute top-0 right-0 bottom-0 w-1" style={{ background: `linear-gradient(to bottom, ${jarwiz[500]}, ${accentColor}, ${jarwiz[600]})` }}></div>

            <div className="backdrop-blur-sm p-10" style={{ backgroundColor: 'rgba(28, 32, 41, 0.85)', color: 'hsl(var(--card-foreground))' }}>
              <CardHeader className="space-y-2 text-center p-0 mb-6">
                <div className="animate-fade-up">
                  <CardTitle className="text-3xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${jarwiz[400]}, ${accentColor})` }}>
                    Create your account
                  </CardTitle>
                </div>
                <CardDescription className="opacity-90 delay-100 text-base" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  Get started with JarwizAI today
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 p-0">
                <div className="grid gap-6 relative">
                  <Button
                    variant="outline"
                    className="border border-gray-700 hover:bg-gray-800 hover:text-white transition-colors flex items-center justify-center gap-2 animate-fade-in delay-200"
                    onClick={handleGoogleSignup}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="border-2 border-t-transparent border-jarwiz-500 border-solid rounded-full w-4 h-4 animate-spin"></div>
                    ) : (
                      <>
                        <Mail className="h-5 w-5" style={{ color: accentColor }} />
                        <span className="font-medium bg-gradient-to-r from-jarwiz-300 to-accent bg-clip-text text-transparent">
                          Continue with Google
                        </span>
                      </>
                    )}
                  </Button>

                  <div className="h-px w-full bg-gradient-to-r from-transparent via-jarwiz-500/30 to-transparent my-4"></div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 text-center text-sm pt-2 p-0" style={{ color: 'hsl(var(--muted-foreground))' }}>
                <p className="delay-300" style={{ color: jarwiz[100] }}>
                  By signing up, you agree to our{' '}
                  <Link href="/terms" className="hover:text-jarwiz-400 transition-colors" style={{ color: accentColor, textDecoration: 'none' }}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="hover:text-jarwiz-400 transition-colors" style={{ color: accentColor, textDecoration: 'none' }}>
                    Privacy Policy
                  </Link>
                </p>


                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: `${jarwiz[600]}/10` }}></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: `${accentColor}/10` }}></div>
              </CardFooter>
            </div>
          </div>
        </div>
      </main>
      <style jsx global>{`
        :root {
          --background: #0c0d10;
          --foreground: 0 0% 98%;
          --card: 26, 29, 37;
          --card-foreground: 0 0% 98%;
          --popover: 240 10% 3.9%;
          --popover-foreground: 0 0% 98%;
          --primary: 210 100% 50%;
          --primary-foreground: 210 40% 98%;
          --secondary: 240 10% 15%;
          --secondary-foreground: 0 0% 98%;
          --muted: 240 10% 15%;
          --muted-foreground: 240 5% 75%;
          --accent: 320 90% 60%;
          --accent-foreground: 0 0% 98%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 210 40% 98%;
          --border: 240 10% 15%;
          --input: 240 10% 15%;
          --ring: 240 10% 30%;
          --radius: 0.5rem;
          --sidebar-background: 240 10% 3%;
          --sidebar-foreground: 240 5% 90%;
          --sidebar-primary: 210 100% 50%;
          --sidebar-primary-foreground: 0 0% 98%;
          --sidebar-accent: 240 10% 15%;
          --sidebar-accent-foreground: 240 5% 90%;
          --sidebar-border: 240 10% 15%;
          --sidebar-ring: 210 100% 50%;
        }

        .dark {
          --background: 240 10% 3.9%;
          --foreground: 0 0% 98%;
          --card: 240 10% 3.9%;
          --card-foreground: 0 0% 98%;
          --popover: 240 10% 3.9%;
          --popover-foreground: 0 0% 98%;
          --primary: 210 100% 50%;
          --primary-foreground: 0 0% 98%;
          --secondary: 240 10% 15.9%;
          --secondary-foreground: 0 0% 98%;
          --muted: 240 10% 15.9%;
          --muted-foreground: 240 5% 75%;
          --accent: 320 90% 60%;
          --accent-foreground: 0 0% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 0 0% 98%;
          --border: 240 10% 20%;
          --input: 240 10% 20%;
          --ring: 240 10% 30%;
          --sidebar-background: 240 10% 5%;
          --sidebar-foreground: 240 5% 90%;
          --sidebar-primary: 210 100% 50%;
          --sidebar-primary-foreground: 0 0% 98%;
          --sidebar-accent: 240 10% 15%;
          --sidebar-accent-foreground: 240 5% 90%;
          --sidebar-border: 240 10% 20%;
          --sidebar-ring: 210 100% 50%;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-fade-up {
          animation: fade-up 0.5s ease-out;
        }

        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }

          50% {
            opacity: 0.8;
          }
        }

        .container {
          @apply w-full;
          @apply max-w-2xl;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1rem;
          padding-right: 1rem;
        }

        @media (min-width: 640px) {
          .container {
            max-w-md;
          }
        }

        @media (min-width: 768px) {
          .container {
            max-w-lg;
          }
        }

        @media (min-width: 1024px) {
          .container {
            max-w-xl;
          }
        }

        @media (min-width: 1280px) {
          .container {
            max-w-2xl;
          }
        }

        @media (min-width: 1536px) {
          .container {
            max-w-3xl;
          }
        }
      `}</style>
    </div>
  );
};

export default Signup;