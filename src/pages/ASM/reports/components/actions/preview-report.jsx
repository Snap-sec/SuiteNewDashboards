import { View } from 'lucide-react';
import { Button } from '@/components/ui/button';

import appConfig from '../../../../../config/appConfig';

function PreviewReport({ reportId, isDisabled }) {
  return (
    <Button
      disabled={isDisabled}
      variant="ghost"
      onClick={() =>
        window.open(
          `${appConfig.BASE_URL}/op/api/v1/reports/preview/${reportId}?token=${localStorage.getItem('token')}`,
          '_blank',
        )
      }
    >
      <View />
    </Button>
  );
}

export default PreviewReport;
