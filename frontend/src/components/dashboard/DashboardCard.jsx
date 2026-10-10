import './DashboardCard.css';

export function DashboardCard({
  title,
  value,
  icon,
  subtitle,
  trend,
  color = 'indigo', // indigo, green, amber, purple, rose
}) {
  return (
    <div className={`dashboard-stat-card card-accent-${color}`}>
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        <div className={`stat-card-icon icon-bg-${color}`}>{icon}</div>
      </div>
      <div className="stat-card-body">
        <span className="stat-card-value">{value}</span>
        {subtitle && <span className="stat-card-sub">{subtitle}</span>}
      </div>
      {trend && (
        <div className="stat-card-footer">
          <span className="stat-trend">{trend}</span>
        </div>
      )}
    </div>
  );
}

export default DashboardCard;
