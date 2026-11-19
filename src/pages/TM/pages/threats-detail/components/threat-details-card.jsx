import { useEffect, useState } from 'react';
import { CheckIcon, SquarePen, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ContentLoader } from '@/components/common/content-loader';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import SeverityLabel from '@/components/custom/severity-label';
import { StatusBadge } from '@/components/custom/status-badge';
import CustomSelect from '../../../../../components/custom/select';
import { Textarea } from '../../../../../components/ui/textarea';
import {
  useDeleteThreatByIdMutation,
  useUpdateThreatDetailsByIdMutation,
} from '../../../../../services/tm/threatApi';
import useStore from '../store';
import ConclusionModal from './conclusion-modal';
import OwnerDropdown from './dropdowns/owner-dropdown';
import FullRequest from './full-request';
import UnderstandingState from './understand-states-model';

const STATES = [
  { label: 'Pending', value: 'pending' },
  { label: 'Acknowledge', value: 'acknowledged' },
  { label: 'Risk Accepted', value: 'risk_accepted' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Need More Info', value: 'need_more_info' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Fixed', value: 'fixed' },
  { label: 'Fix Verified', value: 'fix_verified' },
];

const SEVERITY = [
  { label: 'Critical', value: 'critical' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
];

const ThreatDetailsCard = ({ data, project }) => {
  const navigate = useNavigate();

  const [referencesToCode, setReferencesToCode] = useState('');
  const [state, setState] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingRow, setEditingRow] = useState(null);

  const [updateThreat] = useUpdateThreatDetailsByIdMutation();
  const [deleteThreat] = useDeleteThreatByIdMutation();

  const [payload, setPayload] = useState(null);

  const setShowConclusionModal = useStore(
    (state) => state.setShowConclusionModal,
  );
  const setConclusionOf = useStore((state) => state.setConclusionOf);
  const setConclusion = useStore((state) => state.setConclusion);
  const conclusion = useStore((state) => state.conclusion);

  const handleUpdate = (updates, threatId) => {
    toast.promise(updateThreat({ updates, threatId: threatId }).unwrap(), {
      loading: 'Updating Threat',
      success: (res) => {
        setEditingRow(null);
        setReferencesToCode('');
        setConclusionOf('');
        setConclusion('');
        setShowConclusionModal(false);
        setState(null);
        setSeverity(null);
        setSelectedProject(null);
        return 'Threat Updated';
      },
      error: (err) => {
        setEditingRow(null);
        setReferencesToCode('');
        setState(null);
        setSeverity(null);
        setSelectedProject(null);
        return 'Failed to update threat';
      },
    });
  };

  const handleDeleteThreat = (id) => {
    toast.promise(deleteThreat(id).unwrap(), {
      loading: 'Deleting Threat',
      success: (res) => {
        navigate('/threat-modeler/threats');
        return 'Threat Deleted.';
      },
      error: (err) => 'Failed to delete threat',
    });
  };

  const preparePayload = () => {
    const updates = {};

    if (referencesToCode !== '' && editingRow === 'references') {
      updates['references_to_code'] = referencesToCode;
    }

    if (state && editingRow === 'status') {
      updates['state'] = state.value;
    }

    if (severity && editingRow === 'severity') {
      updates['severity'] = severity.value;
    }

    if (selectedProject && editingRow === 'project') {
      updates['projectId'] = selectedProject.value; // update project ID
    }

    setPayload(updates);

    return updates;
  };

  // Update Threat Details
  const handleUpdateThreat = () => {
    const updates = preparePayload();

    const keysBeingUpdated = Object.keys(updates);

    // Show conclusion modal if state change requires conclusion
    if (keysBeingUpdated?.includes('state')) {
      let conclusion_required_on = ['rejected', 'risk_accepted', 'fixed'];

      if (conclusion_required_on.includes(updates.state)) {
        setShowConclusionModal(true);
        setConclusionOf(updates.state);
        return;
      }
    }

    if (keysBeingUpdated?.length === 0) {
      setEditingRow(null);
      return;
    }

    handleUpdate(updates, data?._id);
  };

  const handleUpdateInConclusionModal = () => {
    handleUpdate({ ...payload, conclusion }, data?._id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="w-full flex items-center justify-between">
          <span>Threat Details</span>
          <div>
            <AuthorityGuard roles={['Admin']}>
              <ButtonWithConfirm
                variant="ghost"
                confirm={true}
                onConfirm={() => handleDeleteThreat(data?._id)}
              >
                <Trash />
              </ButtonWithConfirm>
            </AuthorityGuard>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="kt-scrollable-x-auto pb-3 p-0">
        <Table
          className="align-middle text-sm text-muted-foreground"
          id="general_info_table"
        >
          <TableBody>
            {/* Request Row */}
            <TableRow>
              <TableCell className="min-w-56 text-secondary-foreground font-normal">
                Request
              </TableCell>
              <TableCell className="min-w-56 w-full text-foreground font-normal flex gap-3">
                <span>{data?.endpointId?.method}</span> - 
                <span className="text-[13px] break-words w-[250px]">
                  {`${data?.endpointId?.url}?${
                    data?.endpointId?.params?.length
                      ? data.endpointId.params
                          .map((p) => `${p.key}=${p.value}`)
                          .join('&')
                      : ''
                  }`}
                </span>
              </TableCell>
              <TableCell className="min-w-48 w-full text-foreground font-normal text-center">
                {data?.endpointId?.raw_request ? (
                  <FullRequest raw={data?.endpointId?.raw_request} showGenerateThreatButton={false}/>
                ) : (
                  ''
                )}
              </TableCell>
            </TableRow>

            {/* Project Row */}
            <TableRow>
              <TableCell className="text-secondary-foreground font-normal">
                Project
              </TableCell>
              <TableCell className="text-foreground font-normal">
                {editingRow === 'project' ? (
                  <Select
                    value={selectedProject?.value || data?.projectId?._id || ''}
                    onValueChange={(value) => {
                      const proj = project?.projects?.find(
                        (p) => p._id === value,
                      );
                      setSelectedProject(
                        proj ? { label: proj.name, value: proj._id } : null,
                      );
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent>
                      {project?.projects &&
                        project?.projects?.map((project) => (
                          <SelectItem key={project._id} value={project._id}>
                            {project.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ) : (
                  data?.projectId?.name || 'No Project'
                )}
              </TableCell>
              <TableCell className="text-center">
                {editingRow === 'project' ? (
                  <Button
                    variant="ghost"
                    mode="icon"
                    onClick={handleUpdateThreat}
                  >
                    <CheckIcon size={16} className="text-green-500" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    mode="icon"
                    onClick={() => {
                      setEditingRow('project');
                      setSelectedProject(
                        data?.projectId
                          ? {
                              label: data.data.projectId.name,
                              value: data.data.projectId._id,
                            }
                          : null,
                      );
                    }}
                  >
                    <SquarePen size={16} className="text-blue-500" />
                  </Button>
                )}
              </TableCell>
            </TableRow>

            {/* Severity Row */}
            <TableRow>
              <TableCell className="text-secondary-foreground font-normal">
                Severity
              </TableCell>
              <TableCell className="text-foreground text-sm font-normal">
                {editingRow === 'severity' ? (
                  <CustomSelect
                    options={SEVERITY}
                    onChange={(value) => setSeverity(value)}
                    value={
                      severity ||
                      SEVERITY.find(
                        (opt) => opt.value === (data?.severity || 'low'),
                      )
                    }
                    placeholder="Select Severity"
                    enableSearch={false}
                  />
                ) : (
                  <SeverityLabel severity={data?.severity} />
                )}
              </TableCell>
              <TableCell className="text-center">
                {editingRow === 'severity' ? (
                  <Button
                    variant="ghost"
                    mode="icon"
                    onClick={handleUpdateThreat}
                  >
                    <CheckIcon size={16} className="text-green-500" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    mode="icon"
                    onClick={() => {
                      setEditingRow('severity');
                      setSeverity(
                        SEVERITY.find(
                          (opt) => opt.value === (data?.severity || 'low'),
                        ),
                      );
                    }}
                  >
                    <SquarePen size={16} className="text-blue-500" />
                  </Button>
                )}
              </TableCell>
            </TableRow>

            {/* Confidence Row */}
            <TableRow>
              <TableCell className="text-secondary-foreground font-normal">
                Confidence
              </TableCell>
              <TableCell className="text-foreground font-normal">
                <Badge>{data?.confidence?.value}</Badge>
              </TableCell>
            </TableRow>

            {/* Owner Dropdown */}
            <OwnerDropdown threatDetails={data} />

            {/* Status Row */}
            <TableRow>
              <TableCell className="text-secondary-foreground font-normal flex flex-row items-center gap-2 my-auto">
                State <UnderstandingState />
              </TableCell>
              <TableCell className="text-foreground text-sm font-normal">
                {editingRow === 'status' ? (
                  <Select
                    value={state?.value || data?.state || 'pending'}
                    onValueChange={(value) => {
                      setState(STATES.find((s) => s.value === value));
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectGroup>

                      <SelectSeparator />
                      <SelectGroup>
                        <SelectItem value="acknowledged">
                          Acknowledged
                        </SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectGroup>

                      <SelectSeparator />
                      <SelectGroup>
                        <SelectItem value="risk_accepted">
                          Risk Accepted
                        </SelectItem>
                        <SelectItem value="need_more_info">
                          Need More Info
                        </SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="fixed">Fixed</SelectItem>
                      </SelectGroup>

                      <SelectSeparator />
                      <SelectGroup>
                        <SelectItem value="fix_verified">
                          Fix Verified
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2">
                    <StatusBadge status={data?.state || 'Pending'} />
                  </div>
                )}
              </TableCell>
              <TableCell className="text-center">
                {editingRow === 'status' ? (
                  <Button
                    variant="ghost"
                    mode="icon"
                    onClick={handleUpdateThreat}
                  >
                    <CheckIcon size={16} className="text-green-500" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    mode="icon"
                    onClick={() => {
                      setEditingRow('status');
                      setState(
                        STATES.find(
                          (opt) => opt.value === (data?.state || 'pending'),
                        ),
                      );
                    }}
                  >
                    <SquarePen size={16} className="text-blue-500" />
                  </Button>
                )}
              </TableCell>
            </TableRow>

            {/* References Row */}
            <TableRow>
              <TableCell className="text-secondary-foreground font-normal">
                Code References
              </TableCell>
              <TableCell className="text-foreground text-sm font-normal">
                {editingRow === 'references' ? (
                  <Textarea
                    value={referencesToCode}
                    onChange={(e) => setReferencesToCode(e.target.value)}
                    type="textarea"
                    autoFocus
                  />
                ) : (
                  data?.references_to_code || (
                    <span className="text-sm text-secondary-foreground">
                      No references - Add refrence to the relevance code block or repo here.
                    </span>
                  )
                )}
              </TableCell>
              <TableCell className="text-center">
                {editingRow === 'references' ? (
                  <Button
                    variant="ghost"
                    mode="icon"
                    onClick={handleUpdateThreat}
                  >
                    <CheckIcon size={16} className="text-green-500" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    mode="icon"
                    onClick={() => {
                      setEditingRow('references');
                      setReferencesToCode(
                        typeof data?.references_to_code === 'string'
                          ? data?.references_to_code
                          : '',
                      );
                    }}
                  >
                    <SquarePen size={16} className="text-blue-500" />
                  </Button>
                )}
              </TableCell>
            </TableRow>

            {/* Postman Reference Row */}
            <TableRow>
              <TableCell className="text-secondary-foreground font-normal">
                Postman Reference
              </TableCell>
              <TableCell className="text-foreground font-normal">
                {data?.data?.endpointId?.postman_reference ? (
                  <a
                    className="text-primary"
                    target="_blank"
                    href={data?.data?.endpointId?.postman_reference}
                  >
                    {data?.data?.endpointId?.postman_reference?.split('/')?.[2]}
                  </a>
                ) : (
                  'No Reference'
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>

      <ConclusionModal handleUpdate={handleUpdateInConclusionModal} />
    </Card>
  );
};

export { ThreatDetailsCard };
