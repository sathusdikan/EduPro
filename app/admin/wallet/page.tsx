import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Wallet, TrendingUp, ArrowDownCircle, ArrowUpCircle, DollarSign, CreditCard } from "lucide-react";

export default async function AdminWalletPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        redirect("/dashboard");
    }

    // Fetch admin wallet
    const { data: wallet } = await supabase
        .from("admin_wallet")
        .select("*")
        .eq("admin_id", user.id)
        .single();

    // Fetch recent wallet transactions
    const { data: transactions } = await supabase
        .from("wallet_transactions")
        .select(`
            *,
            payment:payment_id(
                transaction_id,
                user:user_id(
                    full_name,
                    email
                ),
                package:package_id(
                    name
                )
            )
        `)
        .eq("admin_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

    // Fetch payment statistics
    const { data: payments } = await supabase
        .from("payments")
        .select("amount, status, created_at")
        .eq("status", "completed");

    const totalPayments = payments?.length || 0;
    const totalRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

    // Calculate today's earnings
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEarnings = transactions?.filter(t => {
        const txDate = new Date(t.created_at);
        txDate.setHours(0, 0, 0, 0);
        return txDate.getTime() === today.getTime() && t.transaction_type === 'credit';
    }).reduce((sum, t) => sum + Number(t.amount), 0) || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            <Wallet className="h-8 w-8 text-blue-600" />
                            Admin Wallet
                        </h1>
                        <p className="text-gray-500 mt-1">Track your earnings and manage your account</p>
                    </div>
                </div>

                {/* Wallet Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Current Balance */}
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-blue-100 text-sm font-medium">Current Balance</p>
                                <Wallet className="h-5 w-5 text-blue-100" />
                            </div>
                            <p className="text-3xl font-bold">₹{wallet?.balance?.toFixed(2) || '0.00'}</p>
                            <p className="text-xs text-blue-100 mt-2">Available for withdrawal</p>
                        </CardContent>
                    </Card>

                    {/* Total Earnings */}
                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-green-100 text-sm font-medium">Total Earnings</p>
                                <TrendingUp className="h-5 w-5 text-green-100" />
                            </div>
                            <p className="text-3xl font-bold">₹{wallet?.total_earnings?.toFixed(2) || '0.00'}</p>
                            <p className="text-xs text-green-100 mt-2">All-time revenue</p>
                        </CardContent>
                    </Card>

                    {/* Today's Earnings */}
                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-purple-100 text-sm font-medium">Today's Earnings</p>
                                <DollarSign className="h-5 w-5 text-purple-100" />
                            </div>
                            <p className="text-3xl font-bold">₹{todayEarnings.toFixed(2)}</p>
                            <p className="text-xs text-purple-100 mt-2">Earned today</p>
                        </CardContent>
                    </Card>

                    {/* Total Transactions */}
                    <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-orange-100 text-sm font-medium">Total Payments</p>
                                <CreditCard className="h-5 w-5 text-orange-100" />
                            </div>
                            <p className="text-3xl font-bold">{totalPayments}</p>
                            <p className="text-xs text-orange-100 mt-2">Successful transactions</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Account Details */}
                {wallet && (
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-blue-600" />
                                Account Details
                            </CardTitle>
                            <CardDescription>Your payment account information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Account Number</p>
                                    <p className="font-semibold">{wallet.account_number || 'Not set'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Bank Name</p>
                                    <p className="font-semibold">{wallet.bank_name || 'Not set'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">IFSC Code</p>
                                    <p className="font-semibold">{wallet.ifsc_code || 'Not set'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">UPI ID</p>
                                    <p className="font-semibold">{wallet.upi_id || 'Not set'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Transaction History */}
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ArrowUpCircle className="h-5 w-5 text-green-600" />
                            Transaction History
                        </CardTitle>
                        <CardDescription>Recent wallet transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {transactions && transactions.length > 0 ? (
                            <div className="space-y-3">
                                {transactions.map((txn: any) => (
                                    <div
                                        key={txn.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-full ${txn.transaction_type === 'credit'
                                                    ? 'bg-green-100 dark:bg-green-900/30'
                                                    : 'bg-red-100 dark:bg-red-900/30'
                                                }`}>
                                                {txn.transaction_type === 'credit' ? (
                                                    <ArrowDownCircle className="h-5 w-5 text-green-600" />
                                                ) : (
                                                    <ArrowUpCircle className="h-5 w-5 text-red-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{txn.description}</p>
                                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                    <span>{new Date(txn.created_at).toLocaleString()}</span>
                                                    {txn.payment?.transaction_id && (
                                                        <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">
                                                            {txn.payment.transaction_id}
                                                        </span>
                                                    )}
                                                </div>
                                                {txn.payment?.user && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        From: {txn.payment.user.full_name || txn.payment.user.email}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-lg font-bold ${txn.transaction_type === 'credit'
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                                }`}>
                                                {txn.transaction_type === 'credit' ? '+' : '-'}₹{Number(txn.amount).toFixed(2)}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Balance: ₹{Number(txn.balance_after).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Wallet className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No transactions yet</p>
                                <p className="text-sm text-gray-400 mt-1">Transactions will appear here when students make payments</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
