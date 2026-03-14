'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Plus, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function Dashboard() {
    const [agreements, setAgreements] = useState([]);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const userStr = Cookies.get('user');
        if (!userStr) {
            router.push('/auth');
            return;
        }
        const userData = JSON.parse(userStr);
        setUser(userData);
        fetchAgreements(userData.email);
    }, [router]);

    const fetchAgreements = async (email: string) => {
        try {
            const res = await fetch(`/api/agreements?email=${email}`);
            const data = await res.json();
            setAgreements(data);
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Verified':
                return <CheckCircle2 className="w-5 h-5 text-success" />;
            case 'Pending Verification':
                return <Clock className="w-5 h-5 text-orange-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-400" />;
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case 'Verified':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'Pending Verification':
                return 'bg-orange-50 text-orange-700 border-orange-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    if (!user) return <div className="p-8 text-center text-gray-500">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 animate-slide-up">Welcome back, {user.name}</h1>
                    <p className="mt-1 text-gray-500 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                        Manage your digital commitments and verify pending agreements.
                    </p>
                </div>
                <div className="mt-4 md:mt-0 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                    <Link href="/agreements/new" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-md text-white bg-primary hover:bg-primary/90 transition-all hover:shadow-lg">
                        <Plus className="w-5 h-5 mr-2" />
                        New Agreement
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                <div className="glass-card p-6 flex items-center">
                    <div className="p-3 rounded-xl bg-blue-50 text-primary mr-4">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Agreements</p>
                        <p className="text-2xl font-bold border-b border-transparent">{agreements.length}</p>
                    </div>
                </div>
                <div className="glass-card p-6 flex items-center">
                    <div className="p-3 rounded-xl bg-orange-50 text-orange-600 mr-4">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Pending Verification</p>
                        <p className="text-2xl font-bold">{agreements.filter((a: any) => a.status === 'Pending Verification').length}</p>
                    </div>
                </div>
                <div className="glass-card p-6 flex items-center">
                    <div className="p-3 rounded-xl bg-green-50 text-success mr-4">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Verified & Active</p>
                        <p className="text-2xl font-bold">{agreements.filter((a: any) => a.status === 'Verified').length}</p>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-6 animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>Recent Agreements</h2>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-slide-up" style={{ animationDelay: '0.5s', animationFillMode: 'both' }}>
                {agreements.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                        <FileText className="w-12 h-12 text-gray-300 mb-4" />
                        <p>You have no agreements yet.</p>
                        <Link href="/agreements/new" className="mt-4 text-primary font-medium hover:underline">Create your first one</Link>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {agreements.map((agreement: any) => (
                            <li key={agreement._id} className="hover:bg-gray-50 transition-colors">
                                <Link href={`/agreements/${agreement._id}`} className="block px-6 py-5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-bold text-gray-900 truncate">{agreement.title}</p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                With {agreement.partyAEmail === user.email ? agreement.partyBName : agreement.partyAName}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBg(agreement.status)}`}>
                                                {getStatusIcon(agreement.status)}
                                                <span className="ml-1.5">{agreement.status}</span>
                                            </div>
                                            <p className="mt-2 flex items-center text-xs text-gray-500">
                                                Due: {new Date(agreement.dueDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
