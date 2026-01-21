import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { name, description, price, duration_months, features, is_active } = body;

        // Validate required fields
        if (!name || price === undefined || duration_months === undefined) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Insert the package
        const { data, error } = await supabase
            .from("packages")
            .insert({
                name,
                description,
                price,
                duration_months,
                features: features || [],
                is_active: is_active !== undefined ? is_active : true,
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating package:", error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error: any) {
        console.error("Error in POST /api/admin/packages:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("packages")
            .select("*")
            .order("price", { ascending: true });

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
