import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import TestCredentialsModel from './test-crendiantials-model';


function DetailsAndPassword({ environment, testUrl, authenticationType, testCredentials, loading }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-44" />
        </CardHeader>
        <CardContent className="pt-3.5 pb-3.5 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between items-center py-1">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-44" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Technical Access Details</CardTitle>
      </CardHeader>
      <CardContent>
      <Table>
       <TableBody>
        <TableRow className="border-0">
            <TableCell className="text-sm text-secondary-foreground pb-3 pe-4 lg:pe-8 py-2">
              Environment:
            </TableCell>
            <TableCell className="text-sm text-mono pb-3 py-2">{environment || 'N/A'}</TableCell>
        </TableRow>

        <TableRow className="border-0">
            <TableCell className="text-sm text-secondary-foreground pb-3 pe-4 lg:pe-8 py-2">
            Test URL:
            </TableCell>
            <TableCell className="text-sm text-mono pb-3 py-2">{testUrl || 'N/A'}</TableCell>
        </TableRow>


        <TableRow className="border-0">
            <TableCell className="text-sm text-secondary-foreground pb-3 pe-4 lg:pe-8 py-2">
            Authentication Type:
            </TableCell>
            <TableCell className="text-sm text-mono pb-3 py-2">{authenticationType || 'N/A'}</TableCell>
        </TableRow>

        <TableRow className="border-0">
            <TableCell className="text-sm text-secondary-foreground pb-3 pe-4 lg:pe-8 py-2">
            Test Credentials:
            </TableCell>
            <TableCell className="text-sm text-mono pb-3 py-2">
             <span className='relative'>
                {/* <Input
                    placeholder="Enter password"
                    type={passwordVisible ? 'text' : 'password'}
                    value={testCredentials || 'N/A'}
                    enabled={false}
                    className="w-60 inline-block"
                />
                <Button
                    type="button"
                    variant="ghost"
                    mode="icon"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent">
                    {passwordVisible ? (
                    <EyeOff className="text-muted-foreground" />
                    ) : (
                    <Eye className="text-muted-foreground" />
                    )}
                </Button> */}
               <TestCredentialsModel Credentials={testCredentials}/>
             </span>
            </TableCell>
        </TableRow>
        </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default DetailsAndPassword;