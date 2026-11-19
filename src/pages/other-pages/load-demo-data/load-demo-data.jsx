import React, { useState } from 'react';
import { CheckCircle, Database, Import, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useLoadDemoDataMutation } from '../../../services/auth/demoDataApi';

const DemoDataPage = () => {
  const [loadDemoData, { isLoading, isSuccess }] = useLoadDemoDataMutation();

  const handleLoadDemoData = () => {
    toast.promise(loadDemoData().unwrap(), {
      loading: 'Loading demo data...',
      success: 'Demo Data Loaded successfully',
      error: 'Error Loading Demo data',
    });
  };

  return (
    <div className="flex items-center justify-center w-full p-4">
      <Card className="w-full max-w-md p-4 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className=" w-full flex justify-center flex-col">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full">
              <Database className=" text-muted-foreground h-10 w-10" />
            </div>
            <CardTitle className="text-3xl text-muted-foreground">
              Demo Data Loader
            </CardTitle>
          </div>

          <CardDescription className=" text-center w-full">
            Click the button below to load demo data
          </CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center">
          <Button
            onClick={handleLoadDemoData}
            disabled={isLoading}
            size="lg"
            className="w-full"
          >
            {isLoading && (
              <span className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading Demo Data...
              </span>
            )}

            {!isLoading && <Import />}

            {!isLoading && 'Load Demo Data'}
          </Button>
        </CardContent>

        {isSuccess && !isLoading && (
          <CardFooter>
            <div className="flex w-full items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-green-800 mt-4">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                Demo data has been loaded successfully
              </span>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default DemoDataPage;
