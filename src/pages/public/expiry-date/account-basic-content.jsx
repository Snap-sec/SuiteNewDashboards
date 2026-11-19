import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DatePicker from '../../../components/custom/date-picker';
import { Button } from '@/components/ui/button';
import { useUpdateLicenceDateMutation } from '../../../services/auth/authApi';
import { toast } from 'sonner';

function AccountExpiryDateContent() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [displayDate, setDisplayDate] = useState(null);

  const [updateLicenceDate, { isLoading, isError, isSuccess }] = useUpdateLicenceDateMutation();

  // On mount, get licenseExpiry date from localStorage and set displayDate and selectedDate
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.licenceExpiry) {
          const expiryDate = new Date(user.licenceExpiry);
          setDisplayDate(expiryDate);
          setSelectedDate(expiryDate);
        }
      } catch {
        // invalid json or no licenseExpiry field
      }
    }
  }, []);

  // Format date for display as DD/MM/YYYY
  const formatDate = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-GB'); // shows dd/mm/yyyy
  };

  // Handle Edit button click
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (!selectedDate) return;
  
    try {
      const response = await updateLicenceDate({ licenseExpiry: selectedDate.toISOString() }).unwrap();
  
      setDisplayDate(selectedDate);
  
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        user.licenceExpiry = selectedDate.toISOString();
        localStorage.setItem('user', JSON.stringify(user));
      }
  
      setIsEditing(false);
  
      toast.success(response.message || 'License expiry updated successfully!');
    } catch (error) {
      const errorMessage = error?.data?.message || 'License expiry update failed.';
      toast.error(errorMessage);
    }
  };
  

  return (
     <div className="p-6 w-full">
       <Card className=" w-full">
        <CardHeader>
          <CardTitle>Licence Expiry Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              Expiry Date: <p className="font-medium">{formatDate(displayDate)}</p>
            </div>

            {isEditing ? (
              <>
                <div className="w-60">
                  <DatePicker value={selectedDate} onChange={setSelectedDate} />
                </div>
                <Button variant="outline" onClick={handleSaveClick} disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={handleEditClick}>
                Update
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
     </div>
  );
}

export default AccountExpiryDateContent
