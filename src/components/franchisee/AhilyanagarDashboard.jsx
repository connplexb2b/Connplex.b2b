import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AhilyanagarDashboard.css";

const AhilyanagarDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [dailyBreakdown, setDailyBreakdown] = useState([]);
  const [cinemaDetails, setCinemaDetails] = useState(null);
  const [isLive, setIsLive] = useState(false);

  // Filters
  const [activePreset, setActivePreset] = useState("Month-to-Date");
  const [fromDate, setFromDate] = useState("2026-09-01");
  const [toDate, setToDate] = useState("2026-09-20");

  // Toggles
  const [showConfig, setShowConfig] = useState(false);
  const [showSchema, setShowSchema] = useState(false);
  const [customServerUrl, setCustomServerUrl] = useState("");

  const formatCurrency = (val) => {
    if (val === undefined || val === null || isNaN(val)) return "₹0.00";
    return "₹" + Number(val).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatNumber = (val) => {
    if (val === undefined || val === null || isNaN(val)) return "0";
    return Number(val).toLocaleString("en-IN");
  };

  const handlePresetClick = (preset) => {
    setActivePreset(preset);
    const today = "2026-09-20";
    if (preset === "Today") {
      setFromDate(today);
      setToDate(today);
    } else if (preset === "Yesterday") {
      setFromDate("2026-09-19");
      setToDate("2026-09-19");
    } else if (preset === "Last 7 Days") {
      setFromDate("2026-09-14");
      setToDate(today);
    } else if (preset === "Month-to-Date") {
      setFromDate("2026-09-01");
      setToDate(today);
    }
  };

  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      // Try local relative endpoint first, then corporate endpoint
      let response;
      try {
        response = await axios.post("/api/conncloud/ahilyanagar-revenue", {
          CinemaID: "Ahilyanagar",
          FromDate: fromDate,
          ToDate: toDate,
          serverUrl: customServerUrl || undefined,
        }, { timeout: 8000 });
      } catch (relErr) {
        response = await axios.post("https://www.theconnplex.com/api/conncloud/ahilyanagar-revenue", {
          CinemaID: "Ahilyanagar",
          FromDate: fromDate,
          ToDate: toDate,
          serverUrl: customServerUrl || undefined,
        }, { timeout: 12000 });
      }

      if (response.data?.Status === "1" && response.data?.data) {
        setSummary(response.data.data.Summary);
        setDailyBreakdown(response.data.data.DailyBreakdown || []);
        setCinemaDetails(response.data.data.Cinema);
        setIsLive(!!response.data.isLive);
      }
    } catch (err) {
      console.error("Failed to load revenue data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [fromDate, toDate]);

  const exportCSV = () => {
    if (!dailyBreakdown.length) return alert("No records available to export.");
    const rows = dailyBreakdown.map((r) => [
      r.Date,
      r.Day || "",
      r.TicketsSold,
      r.OccupancyPercent ? `${r.OccupancyPercent}%` : "",
      r.TicketRevenue.toFixed(2),
      r.DailyATP.toFixed(2),
      r.FnBItemsSold,
      r.FnBRevenue.toFixed(2),
      r.DailySPH.toFixed(2),
      (r.Glass3DRevenue || 0).toFixed(2),
      r.TotalDailyRevenue.toFixed(2),
    ]);

    if (summary) {
      rows.push([
        "TOTAL / SUMMARY",
        "MTD",
        summary.TotalTicketsSold,
        summary.OverallOccupancyPercent ? `${summary.OverallOccupancyPercent}%` : "",
        summary.TotalTicketRevenue.toFixed(2),
        summary.OverallATP.toFixed(2),
        summary.TotalFnBItemsSold,
        summary.TotalFnBRevenue.toFixed(2),
        summary.OverallSPH.toFixed(2),
        (summary.Total3DGlassRevenue || 0).toFixed(2),
        summary.TotalGrossRevenue.toFixed(2),
      ]);
    }

    const headers = [
      "Date,Day,Admits (Tickets Sold),Occu %,Box Office (INR),Daily ATP (INR),F&B Items Sold,Café F&B (INR),Daily SPH (INR),3D Glass (INR),Total Daily Gross (INR)"
    ];
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows.map((e) => e.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = `Ahilyanagar_Revenue_${fromDate}_to_${toDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="ahilyanagar-revenue-dashboard" className="ahilyanagar-dashboard-container">
      {/* Header Card */}
      <div className="ahilyanagar-header-card">
        <div className="header-top-row">
          <div>
            <div className="badge-row">
              <span className="badge-gold">OFFICIAL FRANCHISE PORTAL API</span>
              <span className="badge-blue">Audited MTD Stored Procedure Data</span>
              {isLive && <span className="badge-green">Live Vista Connected</span>}
            </div>
            <h1 className="ahilyanagar-title">Ahilyanagar Franchise Daily Revenue Dashboard</h1>
            <p className="ahilyanagar-subtitle">
              Connplex Smart Theatre &bull; Cinema ID: <strong>{cinemaDetails?.CinemaId || "CL16"}</strong> &bull; Partner: <span className="partner-name">Vikram Shinde</span> &bull; Period: {fromDate} to {toDate}
            </p>
          </div>
          <div className="btn-group">
            <button className="btn-action" onClick={() => setShowConfig(!showConfig)}>Endpoint Config</button>
            <button className="btn-action" onClick={() => setShowSchema(!showSchema)}>Schema &amp; API Specs</button>
            <button className="btn-csv" onClick={exportCSV}>Export CSV</button>
            <button className="btn-refresh" onClick={fetchRevenueData} disabled={loading}>
              {loading ? "Syncing..." : "Refresh"}
            </button>
          </div>
        </div>

        {showConfig && (
          <div className="config-drawer">
            <span>Vista IIS Server:</span>
            <input
              type="text"
              placeholder="e.g. http://192.168.1.100 or http://theatre.ahilyanagar.com"
              value={customServerUrl}
              onChange={(e) => setCustomServerUrl(e.target.value)}
              className="date-input"
              style={{ flex: 1 }}
            />
            <button className="btn-refresh" onClick={fetchRevenueData}>Connect &amp; Test</button>
          </div>
        )}

        {/* Date Filter Bar */}
        <div className="filter-bar">
          <div className="preset-group">
            {["Today", "Yesterday", "Last 7 Days", "Month-to-Date"].map((preset) => (
              <button
                key={preset}
                onClick={() => handlePresetClick(preset)}
                className={`preset-btn ${activePreset === preset ? "active" : ""}`}
              >
                {preset}
              </button>
            ))}
          </div>
          <div className="date-picker-group">
            <span>Range:</span>
            <input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setActivePreset("Custom"); }} className="date-input" />
            <span>to</span>
            <input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setActivePreset("Custom"); }} className="date-input" />
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-label">TOTAL GROSS REVENUE</span>
            <div className="kpi-value">{formatCurrency(summary?.TotalGrossRevenue)}</div>
            <div className="kpi-footer">
              <span>Box Office + Café F&amp;B</span>
              <span style={{ color: "#34d399" }}>3D Glass: {formatCurrency(summary?.Total3DGlassRevenue || 0)}</span>
            </div>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">BOX OFFICE REVENUE</span>
            <div className="kpi-value">{formatCurrency(summary?.TotalTicketRevenue)}</div>
            <div className="kpi-footer">
              <span>{formatNumber(summary?.TotalTicketsSold)} Tickets Sold</span>
              <span style={{ color: "#60a5fa" }}>ATP: {formatCurrency(summary?.OverallATP)}</span>
            </div>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">F&amp;B CONCESSIONS</span>
            <div className="kpi-value">{formatCurrency(summary?.TotalFnBRevenue)}</div>
            <div className="kpi-footer">
              <span>{formatNumber(summary?.TotalFnBItemsSold)} Items Sold</span>
              <span style={{ color: "#fbbf24" }}>SPH: {formatCurrency(summary?.OverallSPH)}</span>
            </div>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">F&amp;B / BOX OFFICE RATIO</span>
            <div className="kpi-value" style={{ color: "#34d399" }}>{summary?.FnBToBoxOfficeRatioPercent || 0}%</div>
            <div className="kpi-footer">
              <span>Concession Capture</span>
              <span>Avg Occ: {summary?.OverallOccupancyPercent || 0}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="table-card">
        <div className="table-header">
          <h3>Day-by-Day Financial Breakdown</h3>
          <span>Showing {dailyBreakdown.length} days of audited ticket &amp; concession metrics</span>
        </div>
        <div className="table-wrapper">
          <table className="revenue-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Admits (Tickets)</th>
                <th>Occu %</th>
                <th>Box Office (INR)</th>
                <th>Daily ATP</th>
                <th>F&amp;B Items</th>
                <th>Café F&amp;B (INR)</th>
                <th>Daily SPH</th>
                <th>3D Glass</th>
                <th>Total Daily Gross</th>
              </tr>
            </thead>
            <tbody>
              {dailyBreakdown.map((row) => (
                <tr key={row.Date}>
                  <td><strong>{row.Date}</strong></td>
                  <td>{row.Day}</td>
                  <td>{formatNumber(row.TicketsSold)}</td>
                  <td>{row.OccupancyPercent !== undefined ? `${row.OccupancyPercent}%` : "-"}</td>
                  <td>{formatCurrency(row.TicketRevenue)}</td>
                  <td>{formatCurrency(row.DailyATP)}</td>
                  <td>{formatNumber(row.FnBItemsSold)}</td>
                  <td>{formatCurrency(row.FnBRevenue)}</td>
                  <td>{formatCurrency(row.DailySPH)}</td>
                  <td>{formatCurrency(row.Glass3DRevenue || 0)}</td>
                  <td style={{ color: "#f5b041", fontWeight: "bold" }}>{formatCurrency(row.TotalDailyRevenue)}</td>
                </tr>
              ))}
              {summary && (
                <tr className="summary-row">
                  <td>TOTAL / MTD</td>
                  <td>-</td>
                  <td>{formatNumber(summary.TotalTicketsSold)}</td>
                  <td>{summary.OverallOccupancyPercent}%</td>
                  <td>{formatCurrency(summary.TotalTicketRevenue)}</td>
                  <td>{formatCurrency(summary.OverallATP)}</td>
                  <td>{formatNumber(summary.TotalFnBItemsSold)}</td>
                  <td>{formatCurrency(summary.TotalFnBRevenue)}</td>
                  <td>{formatCurrency(summary.OverallSPH)}</td>
                  <td>{formatCurrency(summary.Total3DGlassRevenue || 0)}</td>
                  <td style={{ color: "#f5b041", fontWeight: "bold" }}>{formatCurrency(summary.TotalGrossRevenue)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schema Specs Modal */}
      {showSchema && (
        <div className="modal-backdrop" onClick={() => setShowSchema(false)}>
          <div className="modal-body" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Full-Stack Solution Architecture &amp; Integration Specs</h3>
              <button onClick={() => setShowSchema(false)}>✕</button>
            </div>
            <div className="specs-grid">
              <div className="spec-card">
                <h4>1. SQL Server Schema (FranchiseDashboard_Schema.sql)</h4>
                <pre>{`EXEC sp_GetFranchiseDashboard
    @CinemaIdentifier = 'Ahilyanagar',
    @FromDate = '2026-09-01',
    @ToDate = '2026-09-20';`}</pre>
              </div>
              <div className="spec-card">
                <h4>2. Web Service API Endpoint (api.asmx)</h4>
                <pre>{`POST /api.asmx/GetFranchiseRevenueDashboard
Host: <vista-server-ip>
Content-Type: application/json`}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AhilyanagarDashboard;
