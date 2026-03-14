'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

const FaceVerification = dynamic(() => import('@/components/FaceVerification'), { ssr: false });

export default function NewAgreementWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [user, setUser] = useState<any>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        partyAName: '',
        partyAEmail: '',
        partyBName: '',
        partyBEmail: '',
        amount: '',
        agreementType: 'money',
        dueDate: '',
        location: ''
    });

    const [agreementId, setAgreementId] = useState<string | null>(null);
    const [partyAHash, setPartyAHash] = useState<string | null>(null);
    const [partyBHash, setPartyBHash] = useState<string | null>(null);

    useEffect(() => {
        const userStr = Cookies.get('user');
        if (!userStr) {
            router.push('/auth');
            return;
        }
        const userData = JSON.parse(userStr);
        setUser(userData);
        setFormData(prev => ({ ...prev, partyAName: userData.name, partyAEmail: userData.email }));
    }, [router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const createAgreement = async () => {
        try {
            const res = await fetch('/api/agreements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            setAgreementId(data._id);
            setStep(2);
        } catch (err) {
            console.error(err);
        }
    };

    const verifyParty = async (party: 'A' | 'B', hash: string) => {
        try {
            await fetch(`/api/agreements/${agreementId}/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ party, hash })
            });

            if (party === 'A') setPartyAHash(hash);
            if (party === 'B') setPartyBHash(hash);

            // If both verified, move to confirmation
            if (party === 'A' && partyBHash) setStep(3);
            if (party === 'B' && partyAHash) setStep(3);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            {/* Progress Wizard */}
            <div className="flex items-center justify-between mb-12">
                <StepIndicator currentStep={step} stepNum={1} label="Details" />
                <div className={`flex-1 h-0.5 mx-4 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                <StepIndicator currentStep={step} stepNum={2} label="Verification" />
                <div className={`flex-1 h-0.5 mx-4 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
                <StepIndicator currentStep={step} stepNum={3} label="Confirmation" />
            </div>

            <div className="glass-card p-8">
                {step === 1 && (
                    <div className="animate-fade-in space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Agreement Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input name="title" onChange={handleInputChange} value={formData.title} placeholder="e.g. Loan for MacBook" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea name="description" onChange={handleInputChange} value={formData.description} rows={3} placeholder="Provide details of the commitment..." className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm"></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Agreement Type</label>
                                <select name="agreementType" onChange={handleInputChange} value={formData.agreementType} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm">
                                    <option value="money">Money Loan</option>
                                    <option value="item return">Item Return</option>
                                    <option value="task commitment">Task Commitment</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Amount (Optional)</label>
                                <input type="number" name="amount" onChange={handleInputChange} value={formData.amount} placeholder="$ 0.00" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Other Party Name (Party B)</label>
                                <input name="partyBName" onChange={handleInputChange} value={formData.partyBName} placeholder="Jane Smith" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Other Party Email</label>
                                <input type="email" name="partyBEmail" onChange={handleInputChange} value={formData.partyBEmail} placeholder="jane@example.com" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                                <input type="date" name="dueDate" onChange={handleInputChange} value={formData.dueDate} className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Location (Optional)</label>
                                <input name="location" onChange={handleInputChange} value={formData.location} placeholder="e.g. New York, NY" className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-gray-100">
                            <button onClick={createAgreement} className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-md">
                                Next Step <ArrowRight className="ml-2 w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-slide-up space-y-8">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-gray-900">Biometric Verification</h2>
                            <p className="mt-2 text-gray-500">Both parties must verify their identity to seal the agreement.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                {partyAHash ? (
                                    <div className="p-6 bg-green-50 rounded-2xl border border-green-200 flex flex-col items-center">
                                        <CheckCircle2 className="w-12 h-12 text-success mb-2" />
                                        <p className="font-bold text-green-800">{formData.partyAName}</p>
                                        <p className="text-sm text-green-600">Verified</p>
                                    </div>
                                ) : (
                                    <FaceVerification partyName={formData.partyAName} onVerified={(hash) => verifyParty('A', hash)} />
                                )}
                            </div>

                            <div className="space-y-4">
                                {partyBHash ? (
                                    <div className="p-6 bg-green-50 rounded-2xl border border-green-200 flex flex-col items-center">
                                        <CheckCircle2 className="w-12 h-12 text-success mb-2" />
                                        <p className="font-bold text-green-800">{formData.partyBName}</p>
                                        <p className="text-sm text-green-600">Verified</p>
                                    </div>
                                ) : (
                                    <FaceVerification partyName={formData.partyBName} onVerified={(hash) => verifyParty('B', hash)} />
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-slide-up text-center py-12">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <CheckCircle2 className="w-12 h-12 text-success" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Agreement Finalized!</h2>
                        <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto">
                            The Commitment Integrity Hash (CIH) has been securely generated and attached to your professional PDF certificate.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => router.push(`/agreements/${agreementId}`)} className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-primary hover:bg-primary/90 transition-all hover:-translate-y-1">
                                View Certificate
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StepIndicator({ currentStep, stepNum, label }: { currentStep: number, stepNum: number, label: string }) {
    const isActive = currentStep >= stepNum;
    return (
        <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${isActive ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                {isActive && currentStep > stepNum ? <CheckCircle2 className="w-6 h-6" /> : stepNum}
            </div>
            <span className={`mt-2 text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
        </div>
    );
}
