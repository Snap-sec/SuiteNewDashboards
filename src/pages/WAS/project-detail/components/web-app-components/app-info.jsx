import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Plus, X } from 'lucide-react';
import { useGetOrgMembersQuery } from '@/services/auth/orgApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Select from '@/components/custom/select';

const AppInfo = forwardRef(function AppInfo({ data, isLoading }, ref) {
  const [tagInput, setTagInput] = useState(data?.tags?.join(',') || '');
  const [tags, setTags] = useState(data?.tags || []);
  const [search, setSearch] = useState('');
  const [owner, setOwner] = useState(data?.data?.owner || null); // {label, value: {id, name, email}}
  const [memberOptions, setMemberOptions] = useState([]);
  const [targetUrl, setTargetUrl] = useState('');
  const [appName, setAppName] = useState('');

  const targetUrlRef = useRef('');
  const appNameRef = useRef('');

  const { data: orgMembers, isFetching } = useGetOrgMembersQuery({ search });

  useEffect(() => {
    targetUrlRef.current = targetUrl;
  }, [targetUrl]);

  useEffect(() => {
    appNameRef.current = appName;
  }, [appName]);

  useEffect(() => {
    if (!data?.data?.configuration) return;

    setTargetUrl(data?.data?.configuration?.target_url || '')
    setAppName(data?.data?.configuration?.application_name || '')

    setTags(data?.data?.configuration?.tags || []);
    setTagInput((data?.data?.configuration?.tags || []).join(','));
    setOwner({userId:data?.data?.owner?.userId, email:data?.data?.owner?.email ,name:data?.data?.owner?.name})
  }, [data]);

  console.log(owner,"xxxxxx");
  

  useEffect(() => {
    if (orgMembers?.data?.members) {
      const formatted = orgMembers.data.members.map((m) => ({
        id: m.userId,
        label: m.name || m.email,
        value: { id: m.userId, name: m.name, email: m.email },
      }));
      setMemberOptions(formatted);
    }
  }, [orgMembers]);

  const addTag = () => {
    if (!tagInput.trim()) return;

    setTags([...tags, tagInput.trim()]);
    setTagInput('');
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  useImperativeHandle(ref, () => ({
    getData: () => ({
      targetUrl: targetUrlRef.current,
      applicationName: appNameRef.current,
      owner: owner
        ? {
            userId: owner?.id,
            name: owner?.value?.name,
            email: owner?.value?.email,
          }
        : null,
      tags: tags,
    }),
  }));

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <div>
        <p className="text-sm">Target URL *</p>
        <Input
          type="text"
          value={targetUrl}
          placeholder="https://example.com"
          onChange={(e) => setTargetUrl(e.target.value)}
        />
      </div>

      <div>
        <p className="text-sm">Application Name *</p>
        <Input
          value={appName}
          type="text"
          placeholder="My web app"
          onChange={(e) => setAppName(e.target.value)}
        />
      </div>

      <div>
        <Label>Owner</Label>
        <Select
          placeholder="Select Owner"
          options={memberOptions}
          value={owner?.userId || owner?.id}
          onChange={setOwner}
          onSearchChange={setSearch}
          isSearching={isFetching}
        />
      </div>

      <div>
        <p className="text-sm">Tags</p>

        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Add tag (e.g., production, api)"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTag()}
          />

          <Button onClick={addTag}>
            <Plus />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1 px-3 py-1"
            >
              {tag}
              <X
                size={14}
                className="cursor-pointer"
                onClick={() => removeTag(index)}
              />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
});

export default AppInfo;
