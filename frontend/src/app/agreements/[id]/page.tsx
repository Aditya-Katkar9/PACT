'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { FileDown, RefreshCw, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';

export default function AgreementDetail() {
    const router = useRouter();
    const params = useParams();
    const [agreement, setAgreement] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userStr = Cookies.get('user');
        if (!userStr) {
            router.push('/auth');
            return;
        }
        setUser(JSON.parse(userStr));
        fetchAgreement();
    }, [router, params.id]);

    const fetchAgreement = async () => {
        try {
            const res = await fetch(`/api/agreements/${params.id}`);
            const data = await res.json();
            setAgreement(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = () => {
        window.open(`/api/agreements/${params.id}/pdf`, '_blank');
    };

    if (loading) return <div className="p-12 flex justify-center"><RefreshCw className="w-8 h-8 text-primary animate-spin" /></div>;
    if (!agreement) return <div className="p-12 text-center text-gray-500">Agreement not found.</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-slide-up">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">{agreement.title}</h1>
                    <p className="mt-2 text-gray-500 flex items-center">
                        <ShieldCheck className="w-4 h-4 mr-1 text-primary" /> Commitment Integrity Protected
                    </p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-4">
                    <button onClick={downloadPDF} className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-md text-white bg-primary hover:bg-primary/90 transition-all hover:-translate-y-1">
                        <FileDown className="mr-2 w-5 h-5" /> Download PDF
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>

                    <div className="glass-card overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center">
                            <FileText className="w-5 h-5 text-gray-400 mr-2" />
                            <h2 className="text-lg font-bold text-gray-900">Agreement Details</h2>
                        </div>
                        <div className="p-6">
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                                    <dd className="mt-1 text-base text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-100 leading-relaxed font-mono text-sm">
                                        {agreement.description}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                                    <dd className="mt-1 text-base text-gray-900 font-medium capitalize">{agreement.agreementType}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Amount</dt>
                                    <dd className="mt-1 text-base text-gray-900 font-medium">{agreement.amount ? `$${agreement.amount}` : 'N/A'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                                    <dd className="mt-1 text-base text-gray-900 font-medium">{new Date(agreement.dueDate).toLocaleDateString()}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Location</dt>
                                    <dd className="mt-1 text-base text-gray-900 font-medium">{agreement.location || 'N/A'}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div className="glass-card overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Parties Involved</h2>
                        </div>
                        <ul className="divide-y divide-gray-100">
                            <li className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Party A</p>
                                    <p className="text-lg font-bold text-gray-900 mt-1">{agreement.partyAName}</p>
                                    <p className="text-sm text-gray-500">{agreement.partyAEmail}</p>
                                </div>
                                {agreement.partyAVerified ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                        <CheckCircle2 className="w-4 h-4 mr-1" /> Biometric Verified
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                                        Pending Verification
                                    </span>
                                )}
                            </li>
                            <li className="p-6 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Party B</p>
                                    <p className="text-lg font-bold text-gray-900 mt-1">{agreement.partyBName}</p>
                                    <p className="text-sm text-gray-500">{agreement.partyBEmail}</p>
                                </div>
                                {agreement.partyBVerified ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                                        <CheckCircle2 className="w-4 h-4 mr-1" /> Biometric Verified
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                                        Pending Verification
                                    </span>
                                )}
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="md:col-span-1 space-y-8 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                    <div className="glass-card overflow-hidden">
                        <div className="bg-primary px-6 py-4 border-b border-primary/20 flex flex-col items-center text-center">
                            <ShieldCheck className="w-10 h-10 text-white mb-2" />
                            <h2 className="text-lg font-bold text-white">Integrity Hash (CIH)</h2>
                        </div>
                        <div className="p-6">
                            {agreement.cihHash ? (
                                <div>
                                    <p className="text-xs text-center text-gray-500 mb-2">Cryptographic proof generated on {new Date(agreement.updatedAt).toLocaleDateString()}</p>
                                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs break-all border border-gray-800 shadow-inner">
                                        {agreement.cihHash}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 mb-4">
                                        Pending Verification
                                    </div>
                                    <p className="text-sm text-gray-500">Signatures from both parties are required to generate the CIH proof.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
