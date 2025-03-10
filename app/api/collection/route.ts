export interface Collection {
    id: string;
    name: string;
    secret: string;
    payment_gateway: string;
    collection_key: string;
    status: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }
  
  export async function GET(): Promise<Response> {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections`);
  
      if (!response.ok) {
        throw new Error(`Network response was not ok. Status: ${response.status}`);
      }
  
      const data: Collection[] = await response.json();
  
      if (!Array.isArray(data) || data.length === 0) {
        return new Response(
          JSON.stringify({ success: false, error: "No collections found" } as ApiResponse<null>),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
  
      const latestData = data.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];
  
      return new Response(
        JSON.stringify({ success: true, data: latestData } as ApiResponse<Collection>),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        } as ApiResponse<null>),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
  