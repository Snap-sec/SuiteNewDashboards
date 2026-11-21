export function PageFoot({ company = 'Northwind Labs' }) {
  return (
    <footer className="page-foot">
      <span className="foot-status">
        <span className="live-dot" aria-hidden="true" />
        Inventory reconciled every 15 minutes
      </span>
      <span>Aperture Inventory · {company}</span>
    </footer>
  );
}

export default PageFoot;

