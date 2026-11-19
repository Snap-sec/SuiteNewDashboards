import Crt from './adapter-modals/crt';
import Hackertarget from './adapter-modals/hackertarget';
import Github from './adapter-modals/github';
import Gitlab from './adapter-modals/gitlab';
import Slack from './adapter-modals/slack';
import Swagger from './adapter-modals/swagger';
import Gsheet from './adapter-modals/gsheet';
import Cloudflare from './adapter-modals/cloudflare';
import Censys from './adapter-modals/censys';
import Postman from './adapter-modals/postman';
import Hostinger from './adapter-modals/hostinger';
import Oci from './adapter-modals/oci';
import Csv from './adapter-modals/csv';
import Manual from './adapter-modals/manual';
import Google from './adapter-modals/google';

function ModalRegistry() {
  return (
    <div>
      <Crt />
      <Hackertarget />
      <Github />
      <Gitlab />
      <Slack />
      <Swagger />
      <Gsheet />
      <Cloudflare />
      <Censys />
      <Postman />
      <Hostinger />
      <Oci />
      <Csv />
      <Manual />
      <Google />
    </div>
  );
}

export default ModalRegistry;
