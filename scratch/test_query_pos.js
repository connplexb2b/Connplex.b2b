const VISTA_DC_ENGINE_URL = 'http://103.129.101.135/WSVistaDCEngine/DCEngineService.asmx';
const VISTA_ENDPOINT_SERVER_ID = '192.168.110.2';

async function queryVistaDCEngine(sqlCmd) {
  const soapPayload = `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetList xmlns="http://vista.co.nz/WSVistaDCEngine">
      <cinfo>
        <AppId>CircuitStats</AppId>
        <Stateful>false</Stateful>
        <EndpointServerId>${VISTA_ENDPOINT_SERVER_ID}</EndpointServerId>
      </cinfo>
      <cmd>${sqlCmd.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</cmd>
    </GetList>
  </soap:Body>
</soap:Envelope>`;

  const response = await fetch(VISTA_DC_ENGINE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': 'http://vista.co.nz/WSVistaDCEngine/GetList',
    },
    body: soapPayload,
  });
  return response.text();
}

function parseDiffgramTables(xmlStr) {
  const rows = [];
  const diffgramMatch = xmlStr.match(/<diffgr:diffgram[\s\S]*?<\/diffgr:diffgram>/i);
  if (!diffgramMatch) return rows;

  const tableRegex = /<Table\b[^>]*>([\s\S]*?)<\/Table>/gi;
  let match;
  while ((match = tableRegex.exec(diffgramMatch[0])) !== null) {
    const tableContent = match[1];
    const rowObj = {};
    const fieldRegex = /<([a-zA-Z0-9_]+)>([^<]*)<\/\1>/g;
    let fieldMatch;
    while ((fieldMatch = fieldRegex.exec(tableContent)) !== null) {
      rowObj[fieldMatch[1]] = fieldMatch[2];
    }
    if (Object.keys(rowObj).length > 0) {
      rows.push(rowObj);
    }
  }
  return rows;
}

async function run() {
  const sql = `
    SELECT 
      CONVERT(VARCHAR(10), CAST(TransI_dtmDateTime AS DATE), 120) as Dt,
      COUNT(*) as TotalRows,
      SUM(CASE WHEN TransI_strStatus != 'R' THEN 1 ELSE 0 END) as ValidRows,
      SUM(CASE WHEN TransI_strStatus = 'R' THEN 1 ELSE 0 END) as RefundRows,
      SUM(CASE WHEN TransI_strStatus != 'R' THEN TransI_curValueEach * TransI_decNoOfItems ELSE 0 END) as GrossValid,
      SUM(CASE WHEN TransI_strStatus != 'R' THEN TransI_curValueEach * TransI_decNoOfItems ELSE -(TransI_curValueEach * TransI_decNoOfItems) END) as NetGross
    FROM tblTrans_Inventory WITH (NOLOCK)
    WHERE Item_strItemId = '1' AND CAST(TransI_dtmDateTime AS DATE) BETWEEN '2026-11-01' AND '2026-11-10'
    GROUP BY CAST(TransI_dtmDateTime AS DATE)
    ORDER BY Dt ASC
  `;
  const rows = parseDiffgramTables(await queryVistaDCEngine(sql));
  console.table(rows);
}

run().catch(console.error);
