import React from 'react';
import { ArrowRight, CheckCircle, List, Plus } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function VulnerabilitySuccessPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const handleAddAnother = () => {
    navigate(
      '/pages/public/report-new?assessmentId=' + params.get('assessmentId'),
    );
  };

  const handleViewAll = () => {
    navigate('/vm/vulnerabilities');
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Success Card */}
        <Card className="transform hover:scale-105 transition-all duration-300">
          <CardContent className="p-8 text-center">
            {/* Success Icon with Animation */}
            <div className="relative mb-6">
              {/* <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse"> */}
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto ">
                <CheckCircle className="w-20 h-20 text-green-500" />
              </div>
              {/* Ripple Effect */}
              {/* <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-emerald-300 rounded-full animate-ping opacity-20"></div> */}
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold mb-3  bg-clip-text">Success</h1>

            <p className="text-gray-600 mb-4 leading-relaxed">
              Your vulnerability has been successfully added
            </p>

            <Badge className="mb-8">Security team has been notified</Badge>

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Add Another Button */}
              <Button
                variant="outline"
                onClick={handleAddAnother}
                className="w-full bg-primary hover:bg-gray-400 text-white font-semibold py-6 px-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3 group"
                size="lg"
              >
                <Plus className="w-5 h-5 text-white group-hover:rotate-90 duration-300" />
                Add Another Vulnerability
                <ArrowRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </Button>

              {/* View All Button */}
              <Button
                onClick={handleViewAll}
                variant="outline"
                className="w-full font-semibold py-6 px-6 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3 group"
                size="lg"
              >
                <List className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                View All Vulnerabilities
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </Button>
            </div>

            {/* Progress indicator */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Vulnerability processed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Floating particles effect */}
        <div className="absolute -z-10 inset-0">
          <div
            className="absolute top-10 left-10 w-2 h-2 bg-emerald-400 rounded-full opacity-60 animate-bounce"
            style={{ animationDelay: '0s' }}
          ></div>
          <div
            className="absolute top-20 right-8 w-1 h-1 bg-green-500 rounded-full opacity-40 animate-bounce"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute bottom-20 left-12 w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-50 animate-bounce"
            style={{ animationDelay: '2s' }}
          ></div>
          <div
            className="absolute bottom-32 right-16 w-1 h-1 bg-emerald-300 rounded-full opacity-30 animate-bounce"
            style={{ animationDelay: '3s' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
