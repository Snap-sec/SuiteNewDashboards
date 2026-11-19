import { useState } from 'react';
import { countries } from 'countries-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function getCountryList(countryData) {
  return Object.values(countryData).map((country) => country.name);
}

const AdvancedSettingsAddress = ({ profile, handleUpdate }) => {
  const [address, setAddress] = useState(profile?.address?.street);
  const [country, setCountry] = useState(profile?.address?.country);
  const [state, setState] = useState(profile?.address?.state);
  const [city, setCity] = useState(profile?.address?.city);
  const [postcode, setPostcode] = useState(profile?.address?.postalCode);

  const formattedCountryList = getCountryList(countries);

  return (
    <Card>
      <CardHeader id="advanced_settings_address">
        <CardTitle>Address</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 lg:py-7.5">
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full items-center gap-1 max-w-56">
            Address
          </Label>
          <Input
            id="address"
            type="text"
            placeholder="Avinguda Imaginària, 789"
            defaultValue={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-56">Country</Label>
          <div className="grow">
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              
              <SelectContent>
                {formattedCountryList?.map((country) => (
                  <SelectItem value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-56">State</Label>
          <Input
            id="state"
            type="text"
            placeholder="State"
            defaultValue={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-56">City</Label>
          <Input
            id="city"
            type="text"
            placeholder="Barcelona"
            defaultValue={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
          <Label className="flex w-full max-w-56">Postcode</Label>
          <Input
            id="postcode"
            type="text"
            placeholder="08012"
            defaultValue={postcode}
            onChange={(e) => setPostcode(e.target.value)}
          />
        </div>
        <div className="flex justify-end pt-2.5">
          <Button
            onClick={() =>
              handleUpdate(
                {
                  address: {
                    street: address,
                    country,
                    state,
                    city,
                    postalCode: postcode,
                  },
                },
                'Address',
              )
            }
          >
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export { AdvancedSettingsAddress };
