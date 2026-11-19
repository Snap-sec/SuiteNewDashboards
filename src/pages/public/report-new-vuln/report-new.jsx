import { useCallback, useMemo, useState } from 'react';
import cvss from 'cvss';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { debounce, validatePayload } from '@/lib/helpers';
import { generateMongoLikeObjectId } from '@/lib/utils';
import { useGetVmPublicDetailsQuery } from '@/services/vm/assessmentsApi';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import ButtonGroup from '@/components/custom/button-group';
import Editor from '@/components/custom/Editor';
import { FileUpload } from '@/components/custom/file-upload';
import Select from '@/components/custom/select';
import { useGetAimPublicTransformedAssetsQuery } from '../../../services/asset-inventory/assets/assetsApi';
import {
  useCreateVmAttachmentMetadataMutation,
  useCreateVmVulnMutation,
  useUploadVmAttachmentMutation,
} from '../../../services/vm/vulnerabilityApi';
import CweData from './data/cwe.json';
import { vulnerabilitySchema } from './validations/vuln-validation';

const CVSS_METRIC_ORDER = ['AV', 'AC', 'PR', 'UI', 'S', 'C', 'I', 'A'];

const metricAbbreviationMap = {
  'Attack Vector': 'AV',
  'Attack Complexity': 'AC',
  'Privileges Required': 'PR',
  'User Interaction': 'UI',
  Scope: 'S',
  Confidentiality: 'C',
  Integrity: 'I',
  Availability: 'A',
};

// Define options for each ButtonGroup correctly
const cvssOptions = {
  'Attack Vector': [
    { label: 'Network', value: 'N' },
    { label: 'Adjacent', value: 'A' },
    { label: 'Local', value: 'L' },
    { label: 'Physical', value: 'P' },
  ],
  'Attack Complexity': [
    { label: 'Low', value: 'L' },
    { label: 'High', value: 'H' },
  ],
  'Privileges Required': [
    { label: 'None', value: 'N' },
    { label: 'Low', value: 'L' },
    { label: 'High', value: 'H' },
  ],
  'User Interaction': [
    { label: 'None', value: 'N' },
    { label: 'Required', value: 'R' },
  ],
  Scope: [
    { label: 'Unchanged', value: 'U' },
    { label: 'Changed', value: 'C' },
  ],
  Confidentiality: [
    { label: 'High', value: 'H' },
    { label: 'Low', value: 'L' },
    { label: 'None', value: 'N' },
  ],
  Integrity: [
    { label: 'High', value: 'H' },
    { label: 'Low', value: 'L' },
    { label: 'None', value: 'N' },
  ],
  Availability: [
    { label: 'High', value: 'H' },
    { label: 'Low', value: 'L' },
    { label: 'None', value: 'N' },
  ],
};

function ReportNew() {
  const [assetSearch, setAssetSearch] = useState('');

  const [createVuln] = useCreateVmVulnMutation();
  const [uploadMetadata] = useCreateVmAttachmentMetadataMutation();
  const [uploadAttachment, { isLoading: uploadingAttachment }] =
    useUploadVmAttachmentMutation();
  const [vulnId] = useState(generateMongoLikeObjectId());
  const [files, setFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const [showCustomAssetForm, setShowCustomAssetForm] = useState(false);
  const [customAsset, setCustomAsset] = useState({
    type: '',
    name: '',
    value: '',
  });

  const assetTypeOptions = [
    { label: 'Subdomain', value: 'subdomain' },
    { label: 'Employee', value: 'employee' },
    { label: 'IP Address', value: 'ip' },
    { label: 'Workstation', value: 'workstation' },
    { label: 'Registry', value: 'registry' },
    { label: 'Repository', value: 'repo' },
    { label: 'Application', value: 'application' },
    { label: 'Other', value: 'other' },
    { label: 'Port', value: 'port' },
    { label: 'Cert', value: 'cert' },
    { label: 'DNS', value: 'dns' },
    { label: 'Technology', value: 'tech' },
    { label: 'API', value: 'api' },
  ];

  const navigate = useNavigate();

  const [payload, setPayload] = useState({
    id: '',
    title: '',
    fullMarkdownReport: '',
    cwe: '',
    affectedAssets: [],
  });

  const [selectedMetrics, setSelectedMetrics] = useState({
    AV: 'N',
    AC: 'L',
    PR: 'N',
    UI: 'N',
    S: 'U',
    C: 'H',
    I: 'H',
    A: 'H',
  });

  console.log(selectedMetrics);

  const [cvssString, setCvssString] = useState('CVSS:3.0');
  const [cvssScore, setCvssScore] = useState(null);
  const [cvssRating, setCvssRating] = useState('');

  const [params] = useSearchParams();

  const assessmentId = params.get('assessmentId');

  const { data, isLoading, isFetching } = useGetVmPublicDetailsQuery({
    assessmentId,
    search: assetSearch,
  });

  const {
    data: transformedAssets,
    isLoading: transformedAssetsLoading,
    isFetching: transformedAssetsFetching,
  } = useGetAimPublicTransformedAssetsQuery(
    {
      orgId: data?.data?.orgId,
      params: { search: assetSearch },
    },
    {
      skip: !data?.data?.orgId,
    },
  );

  const CweOptions = useMemo(() => {
    return CweData.map((cwe) => ({
      value: `CWE-${cwe['CWE-ID']}`,
      label: `CWE-${cwe['CWE-ID']}: ${cwe.Name}`,
      email: '', // Add empty email to satisfy interface
      description: cwe.Description,
    }));
  }, []);

  const handleFilesChange = (files) => {
    console.log(files);
    setFiles(files);
  };

  const handleFilesUpload = async () => {
    if (!files || files.length == 0) {
      return;
    }

    for (let file of files) {
      try {
        // create metadata
        let metadata = {
          assessmentId,
          originId: assessmentId,
          origin: 'report',
          type: file.type,
          vulnId: vulnId,
          name: file.name,
        };

        setUploadingFiles(true);

        const response = await uploadMetadata(metadata).unwrap();

        let attachmentId = response?.data?.id;
        setUploadingFiles(false);

        if (!attachmentId) {
          toast.error('Error while uploading ' + metadata.name);
          continue;
        }

        const formdata = new FormData();

        formdata.append('file', file);

        uploadAttachment({ id: attachmentId, file: formdata }).unwrap();
      } catch (error) {
        console.log(error);
        continue;
      }
    }
  };

  const handleMetricChange = useCallback((groupLabel, selectedOption) => {
    const metricKey = metricAbbreviationMap[groupLabel];
    if (!metricKey) {
      console.warn('Unknown metric group:', groupLabel);
      return;
    }

    setSelectedMetrics((prevMetrics) => {
      const newMetrics = {
        ...prevMetrics,
        [metricKey]: selectedOption.value,
      };

      // Construct the display CVSS String (can be partial)
      let displayString = 'CVSS:3.0';
      CVSS_METRIC_ORDER.forEach((key) => {
        if (newMetrics[key]) {
          displayString += `/${key}:${newMetrics[key]}`;
        }
      });

      setCvssString(displayString);

      // Check if all metrics are selected to attempt calculation
      const allMetricsSelected = CVSS_METRIC_ORDER.every(
        (key) => newMetrics[key] !== null,
      );

      if (allMetricsSelected) {
        const calculationString =
          'CVSS:3.0/' +
          CVSS_METRIC_ORDER.map((k) => `${k}:${newMetrics[k]}`).join('/');
        console.log('CVSS Calculation String:', calculationString);
        try {
          const result = cvss.getAll(calculationString);
          console.log('CVSS Calculation Result:', result);
          if (result && result.base && typeof result.base.score === 'number') {
            console.log('Setting CVSS Score:', result.base.score);
            setCvssScore(result.base.score);
            setCvssRating(result.base.rating);
          } else {
            console.error('Invalid CVSS calculation result:', result);
            setCvssScore(null);
            setCvssRating('Error: Invalid CVSS vector.');
          }
        } catch (error) {
          console.error(
            `Error calculating CVSS for vector ${calculationString}:`,
            error,
          );
          setCvssScore(null);
          setCvssRating('Error: Invalid CVSS vector.');
        }
      } else {
        setCvssScore(null);
        setCvssRating('Select all metrics to calculate score.');
      }

      return newMetrics;
    });
  }, []);

  async function handleSubmit() {
    // If custom asset form is open → add it first
    let affectedAssets = payload.affectedAssets;
    if (showCustomAssetForm) {
      if (!customAsset.type || !customAsset.name || !customAsset.value) {
        toast.error('Please fill all asset fields');
        return;
      }

      affectedAssets = [
        {
          type: customAsset.type,
          assetName: customAsset.name,
          value: customAsset.value,
          vulnerableLocation: customAsset.value,
        },
      ];
    }

    let fullMarkdownReport = payload.fullMarkdownReport.trim();

    // check if the first line is H1, otherwise throw error
    let firstLine = fullMarkdownReport.split('\n')[0];

    if (!firstLine || !firstLine.startsWith('# ')) {
      toast.error('First line in report should be a heading');
      return;
    }

    let title =
      payload.fullMarkdownReport?.split('\n')?.find((s) => s.startsWith('#')) ||
      'No Title';

    let fullpayload = {
      ...payload,
      affectedAssets,
      fullMarkdownReport,
      cvssScore: cvssScore,
      cvssRating: cvssRating,
      cvssString: cvssString,
      title: title?.replace(/#/g, ''),
      id: files?.length ? vulnId : '',
    };

    console.log('[+] FULL PAYLOAD: ', fullpayload);

    // const result = validatePayload(fullpayload, vulnerabilitySchema);

    // if (!result.success) return;

    toast.promise(
      createVuln({ assessmentId, ...fullpayload })
        .unwrap()
        .then(() => {
          handleFilesUpload().then(() => {
            navigate(
              `/pages/public/report-new/success?assessmentId=${assessmentId}`,
            );
          });
        }),
      {
        loading: 'Creating Vuln',
        success: () => {
          setCustomAsset({ type: '', name: '', value: '' });
          setShowCustomAssetForm(false);

          return 'Vuln Created';
        },
        error: 'Failed to create vuln',
      },
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-8">
        <Skeleton className="h-[30px]" />
        <Skeleton className="h-[20px]" />
        <Skeleton className="h-[20px]" />
      </div>
    );
  }

  const assets = transformedAssets?.assets?.map((asset, idx) => ({
    type: asset.type,
    name: asset.name || asset.value,
    value: asset.id || `${asset.type}:${asset.value}:${idx}`, // always unique
    label: `${asset.type} - ${asset.value}`,
    originalValue: asset.value,
  }));

  const defaultValue = `
# Title here

## Summary:

## Steps to reproduce:

## Impact:
`;

  return (
    <div className="w-full p-10">
      <div className="bg-card border border-border shadow-xs black/5 p-4 rounded-lg">
        <p className="text-xl">
          {data?.data?.title || 'Report New Vulnerability'}
        </p>

        <div className="w-full flex gap-2 flex-col mt-5">
          <div className="">
            <div className="flex items-center justify-between">
              <p className="text-md">Affected Asset</p>

              <Button
                size="sm"
                className=" mb-2"
                variant="outline"
                onClick={() => {
                  if (showCustomAssetForm) {
                    setShowCustomAssetForm(false);
                    setCustomAsset({ type: '', name: '', value: '' });
                  } else {
                    setShowCustomAssetForm(true);
                  }
                }}
              >
                {showCustomAssetForm ? '✕' : '+ Add'}
              </Button>
            </div>

            {showCustomAssetForm && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                <Select
                  placeholder="Type"
                  options={assetTypeOptions}
                  onChange={(option) =>
                    setCustomAsset((prev) => ({ ...prev, type: option.value }))
                  }
                />

                <input
                  className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                  placeholder="Name (e.g. api.example.com)"
                  value={customAsset.name}
                  onChange={(e) =>
                    setCustomAsset((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />

                <input
                  className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                  placeholder="Value (IP / URL / Host)"
                  value={customAsset.value}
                  onChange={(e) =>
                    setCustomAsset((prev) => ({
                      ...prev,
                      value: e.target.value,
                    }))
                  }
                />
              </div>
            )}

            {!showCustomAssetForm && (
              <Select
                isSearching={isFetching || transformedAssetsFetching || transformedAssetsLoading}
                className="w-full p-4"
                placeholder="Select Affected Asset"
                onSearchChange={debounce(
                  (search) => setAssetSearch(search),
                  500,
                )}
                options={assets}
                onChange={(option) =>
                  setPayload((prev) => ({
                    ...prev,
                    affectedAssets: [
                      {
                        assetName: option.name,
                        type: option.type,
                        value: option.value,
                        vulnerableLocation: option.value,
                      },
                    ],
                  }))
                }
              />
            )}
          </div>

          <div className="">
            <p className="text-md">CWE</p>
            <Select
              options={CweOptions}
              className="w-full p-4"
              placeholder="Select CWE"
              onChange={(option) =>
                setPayload((prev) => ({ ...prev, cwe: option.value }))
              }
            />
          </div>

          <Separator orientation="horizontal" className="w-full" />

          <div className="w-full flex items-center justify-between py-4">
            <p className="text-lg">CVSS V3 Calculator</p>
            <div className="flex flex-col">
              <p className="font-medium">
                CVSS Score: {cvssScore !== null ? cvssScore.toFixed(1) : 'N/A'}
              </p>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {/* Column 1 */}
            <div className="flex flex-col gap-4">
              <ButtonGroup
                className="w-full max-w-[350px]"
                label="Attack Vector"
                options={cvssOptions['Attack Vector']}
                onClick={(option) =>
                  handleMetricChange('Attack Vector', option)
                }
                selectedValue={selectedMetrics.AV}
              />
              <ButtonGroup
                className="w-full max-w-[130px]"
                label="Attack Complexity"
                options={cvssOptions['Attack Complexity']}
                onClick={(option) =>
                  handleMetricChange('Attack Complexity', option)
                }
                selectedValue={selectedMetrics.AC}
              />
              <ButtonGroup
                className="w-full max-w-[200px]"
                label="Privileges Required"
                options={cvssOptions['Privileges Required']}
                onClick={(option) =>
                  handleMetricChange('Privileges Required', option)
                }
                selectedValue={selectedMetrics.PR}
              />
              <ButtonGroup
                className="w-full max-w-[160px]"
                label="User Interaction"
                options={cvssOptions['User Interaction']}
                onClick={(option) =>
                  handleMetricChange('User Interaction', option)
                }
                selectedValue={selectedMetrics.UI}
              />
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-4">
              <ButtonGroup
                className="w-full max-w-[210px]"
                label="Scope"
                options={cvssOptions['Scope']}
                onClick={(option) => handleMetricChange('Scope', option)}
                selectedValue={selectedMetrics.S}
              />
              <ButtonGroup
                className="w-full max-w-[200px]"
                label="Confidentiality"
                options={cvssOptions['Confidentiality']}
                onClick={(option) =>
                  handleMetricChange('Confidentiality', option)
                }
                selectedValue={selectedMetrics.C}
              />
              <ButtonGroup
                className="w-full max-w-[200px]"
                label="Integrity"
                options={cvssOptions['Integrity']}
                onClick={(option) => handleMetricChange('Integrity', option)}
                selectedValue={selectedMetrics.I}
              />
              <ButtonGroup
                className="w-full max-w-[200px]"
                label="Availability"
                options={cvssOptions['Availability']}
                onClick={(option) => handleMetricChange('Availability', option)}
                selectedValue={selectedMetrics.A}
              />
            </div>
          </div>

          <Separator orientation="horizontal" className="w-full" />

          <div className="rounded-md overflow-hidden">
            <p className="text-lg mb-1">Report Editor</p>
            <div className="bg-card border border-border shadow-xs black/5 rounded-lg">
              <Editor
                className="w-full"
                defaultValue={defaultValue}
                onChange={(md) =>
                  setPayload((prev) => ({ ...prev, fullMarkdownReport: md }))
                }
              />
            </div>
          </div>

          <div className="mb-2 w-full">
            <div className="flex gap-3 items-center justify-between ">
              <p className="text-lg mb-1">Attachments Upload</p>
              {/* <Button variant="outline" onClick={handleFilesUpload}><Upload /> Upload Now</Button> */}
            </div>
            <FileUpload
              variant="compact"
              onFilesChange={handleFilesChange}
              maxFileSize={2 * 1024 * 1024}
              maxFiles={5}
              isUploading={uploadingFiles || uploadingAttachment}
            />
          </div>

          <div className="w-full flex items-center justify-end">
            <Button variant="primary" onClick={handleSubmit}>
              + Add Vulnerability
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6"></div>
    </div>
  );
}

export default ReportNew;
