import { NextResponse } from "next/server";

export async function GET() {
    try {
      const response = await fetch(
        "https://api.github.com/search/issues?q=is:issue%20repo:calcom/cal.com%20state:open"
      );
      
      if (!response.ok) {
        if (response.status === 403) {
          return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
        }
        return NextResponse.json({ error: `Error: ${response.status}` }, { status: 500 });
      }
  
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        const randomIssue = data.items[Math.floor(Math.random() * data.items.length)];
        const KEY = process.env.VERCEL_API_KEY
        try {
          const updateEdgeConfig = await fetch(
            'https://api.vercel.com/v1/edge-config/ecfg_kbfpbyx3xdbxb74feaohl3prncfp/items',
            {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                items: [
                  {
                    operation: 'update',
                    key: 'current-issue',
                    value: randomIssue,
                  },
                ],
              }),
            },
          );
          const result = await updateEdgeConfig.json();
          console.log(result);
        } catch (error) {
          console.log(error);
        }
  
        return NextResponse.json(randomIssue);
      } else {
        return NextResponse.json({ error: "No open issues found" }, { status: 404 });
      }
    } catch (err) {
      return NextResponse.json({ error: (err as Error).message }, { status: 500 });
    }
  }
  