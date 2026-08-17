import { useState } from "react";

function DonutChart({
    title,
    subtitle,
    data = [],
    centerLabel,
    centerValue
}) {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
    const radius = 40;
    const strokeWidth = 14;
    const circumference = 2 * Math.PI * radius; // ~251.327

    let cumulativeRatio = 0;

    const segments = data.map((item, idx) => {
        const val = item.value || 0;
        const ratio = total > 0 ? val / total : 0;
        const dashArray = `${ratio * circumference} ${circumference}`;
        const dashOffset = -cumulativeRatio * circumference;
        const currentCumulative = cumulativeRatio;
        cumulativeRatio += ratio;

        return {
            ...item,
            index: idx,
            ratio,
            percentage: Math.round(ratio * 100),
            dashArray,
            dashOffset,
            startRatio: currentCumulative
        };
    });

    return (
        <div className="donut-card">

            <div className="donut-card-header">
                <h4>{title}</h4>
                {subtitle && <p>{subtitle}</p>}
            </div>

            <div className="donut-content">

                {/* SVG Donut Chart */}
                <div className="donut-svg-wrapper">
                    <svg viewBox="0 0 100 100" className="donut-svg">
                        {/* Background circle if empty */}
                        {total === 0 && (
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                fill="transparent"
                                stroke="#E5E7EB"
                                strokeWidth={strokeWidth}
                            />
                        )}

                        {/* Donut Segments */}
                        {total > 0 && segments.map((seg) => (
                            <circle
                                key={seg.label}
                                cx="50"
                                cy="50"
                                r={radius}
                                fill="transparent"
                                stroke={seg.color}
                                strokeWidth={hoveredIndex === seg.index ? strokeWidth + 3 : strokeWidth}
                                strokeDasharray={seg.dashArray}
                                strokeDashoffset={seg.dashOffset}
                                transform="rotate(-90 50 50)"
                                style={{
                                    transition: "all 0.3s ease",
                                    cursor: "pointer",
                                    opacity: hoveredIndex !== null && hoveredIndex !== seg.index ? 0.5 : 1
                                }}
                                onMouseEnter={() => setHoveredIndex(seg.index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            />
                        ))}
                    </svg>

                    {/* Center Text */}
                    <div className="donut-center-text">
                        <span className="donut-center-value">
                            {hoveredIndex !== null
                                ? `${segments[hoveredIndex]?.value ?? 0}`
                                : (centerValue !== undefined ? centerValue : total)}
                        </span>
                        <span className="donut-center-label">
                            {hoveredIndex !== null
                                ? segments[hoveredIndex]?.label
                                : (centerLabel || "Total")}
                        </span>
                    </div>

                </div>

                {/* Legend List */}
                <div className="donut-legend">
                    {segments.map((seg) => (
                        <div
                            key={seg.label}
                            className={`legend-item ${hoveredIndex === seg.index ? "highlight" : ""}`}
                            onMouseEnter={() => setHoveredIndex(seg.index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span
                                    className="legend-color-dot"
                                    style={{ backgroundColor: seg.color }}
                                />
                                <span className="legend-name">{seg.label}</span>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span className="legend-val">{seg.value}</span>
                                <span className="legend-pct">({seg.percentage}%)</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

        </div>
    );
}

export default DonutChart;
