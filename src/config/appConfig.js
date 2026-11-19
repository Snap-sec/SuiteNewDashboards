const PRODUCTS = [
  {
    logo: 'vm.svg',
    id: 'VM',
    title: 'UniRisk',
    name: 'UniRisk',
    link: '/vm',
  },
  {
    logo: 'asm.svg',
    id: 'ASM',
    title: 'Xpose',
    name: 'Xpose',
    link: '/casm',
  },
  {
    logo: 'aim.svg',
    id: 'AIM',
    title: 'AssetIQ',
    name: 'AssetIQ',
    link: '/assetinventory',
  },
  {
    logo: 'autopt.svg',
    id: 'APT',
    title: 'Strike',
    name: 'Strike',
    link: '/apt',
  },
];


// should record telemetry, only on demo.snapsec.co instance
const RECORD_TELEMETRY = window.location.origin === "https://demo.snapsec.co";
const LOGO_DEV_TOKEN = 'pk_AynlgqJFRdCbrstdHMjw4g';

const appConfig = {
  BASE_URL: import.meta.env.VITE_LOCAL ? "http://localhost:9999" : (window._env_?.BASE_URL || "https://staging.snapsec.co"),
  getLogoUrl: (domain) => `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}`,
  PRODUCT_LIST: PRODUCTS,
  recaptchaSiteKey: '6Lc8NbUsAAAAAMbcq-KFE2GWyRNGR7D_ghuufvWg',

  LOGO_URL: '/public/media/logos/snapsec.svg',
  RECORD_TELEMETRY
}

export default appConfig;
