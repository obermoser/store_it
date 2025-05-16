import Image from "next/image";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <section className="bg-brand p-10">
                <div>
                    <Image className="h-auto" src="/Logo.png" width={224} height={82} alt="StoreIt Logo" />
                </div>
                <div className="space-y-5 text-white">
                    <h1 className="h1">Manage your files the best way</h1>
                    <p className="body-1">This is a place where you can store all your documents</p>
                </div>
                <Image src="/Illustration.svg" alt="Illustration" width={342} height={342} className="transition-all hover:rotate-2 hover:scale-105" />
            </section>
            {children}
        </div >
    );
}
