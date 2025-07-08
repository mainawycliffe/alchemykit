import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { csv2json, json2csv } from 'json-2-csv';
import { z } from 'zod';

const server = new McpServer({
  name: 'alchemykit',
  version: '1.0.0',
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.tool(
  'convertCSVToJSON',
  'This tool converts CSV data to JSON format. You can provide CSV data as a string, and it will return the JSON representation of that data. If the request is to convert a csv string to json, you can use this tool to do so.',
  {
    csv: z.string().describe('CSV data as a string'),
  },
  async ({ csv }) => {
    try {
      const res = csv2json(csv);

      // The returned object must have a "content" array with objects of type { type: "text", text: string }
      return {
        content: [{ type: 'text', text: JSON.stringify(res, null, 2) }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Invalid CSV input: ${(error as Error).message}`,
          },
        ],
      };
    }
  }
);

server.tool(
  'convertJSONToCSV',
  'This tool converts JSON data to CSV format. You can provide JSON data as a string, and it will return the CSV representation of that data. If the request is to convert a json string to csv, you can use this tool to do so.',
  {
    json: z.string().describe('JSON data as a string'),
  },
  async ({ json }) => {
    let jsonData;
    try {
      jsonData = JSON.parse(json);
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Invalid JSON input: ${(error as Error).message}`,
          },
        ],
      };
    }
    const res = json2csv(jsonData);

    // The returned object must have a "content" array with objects of type { type: "text", text: string }
    return {
      content: [{ type: 'text', text: res }],
    };
  }
);

const transport = new StdioServerTransport();
(async () => {
  await server.connect(transport);
})();
