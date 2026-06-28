import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { CheckCircle2, Copy, Loader2, Upload as UploadIcon } from "lucide-react";
import { submitApplication } from "@/lib/applications.functions";
import { Footer } from "@/components/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/contestant-apply")({
  head: () => ({
    meta: [
      { title: "MAZ 2027 Online Application — Miss & Mister Agriculture Zambia" },
      { name: "description", content: "Apply online for Miss Agriculture Zambia or Mister Agriculture Zambia 2027. K200 fee · Airtel Money, MTN Money or Bank Card." },
      { property: "og:title", content: "MAZ 2027 Online Application Form" },
      { property: "og:description", content: "Applications open for Miss & Mister Agriculture Zambia 2027." },
    ],
  }),
  component: ApplyPage,
});

const PROVINCES = [
  "Central", "Copperbelt", "Eastern", "Luapula", "Lusaka",
  "Muchinga", "Northern", "North-Western", "Southern", "Western",
];

const ROLE_OPTIONS = ["Farmer", "Agri-student", "Agri-business", "Advocate"] as const;

type Category = "Miss Agriculture Zambia" | "Mister Agriculture Zambia";
type Gender = "Female" | "Male";
type PayMethod = "Airtel Money" | "MTN Money" | "Bank Card" | "Bank Transfer";

type Form = {
  category: Category | "";
  full_name: string;
  date_of_birth: string;
  nrc_number: string;
  gender: Gender | "";
  phone: string;
  email: string;
  province: string;
  occupation: string;
  agri_involved: "" | "yes" | "no";
  agri_roles: string[];
  agri_role_other: string;
  motivation: string;
  payment_method: PayMethod | "";
  payment_reference: string;
  agreed: boolean;
};

const EMPTY: Form = {
  category: "", full_name: "", date_of_birth: "", nrc_number: "",
  gender: "", phone: "+260 ", email: "", province: "", occupation: "",
  agri_involved: "", agri_roles: [], agri_role_other: "",
  motivation: "", payment_method: "", payment_reference: "", agreed: false,
};

async function uploadPublic(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/public/upload", { method: "POST", body: fd });
  if (!res.ok) {
    const j = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(j.error || "Upload failed");
  }
  const j = (await res.json()) as { url: string };
  return j.url;
}

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-white/10 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.2em] text-ivory/60">{label}</p>
        <p className="truncate text-sm text-ivory font-medium">{value}</p>
      </div>
      <button
        type="button"
        onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        className="inline-flex items-center gap-1 rounded-md border border-white/20 px-2 py-1 text-[11px] text-ivory/80 hover:bg-white/10"
      >
        {copied ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

function ApplyPage() {
  const submitFn = useServerFn(submitApplication);
  const [form, setForm] = useState<Form>(EMPTY);
  const [headshotFile, setHeadshotFile] = useState<File | null>(null);
  const [fullbodyFile, setFullbodyFile] = useState<File | null>(null);
  const [nrcFile, setNrcFile] = useState<File | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<{ id: number } | null>(null);

  const m = useMutation({
    mutationFn: submitFn,
    onSuccess: (r) => setDone({ id: r.id }),
    onError: (e: unknown) => setErr(e instanceof Error ? e.message : "Submission failed"),
  });

  function toggleRole(role: string) {
    setForm((f) =>
      f.agri_roles.includes(role)
        ? { ...f, agri_roles: f.agri_roles.filter((r) => r !== role) }
        : { ...f, agri_roles: [...f.agri_roles, role] },
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!form.category) return setErr("Select a category.");
    if (!form.gender) return setErr("Select your gender.");
    if (!form.agri_involved) return setErr("Tell us if you are involved in agriculture.");
    if (!form.payment_method) return setErr("Select a payment method.");
    if (!form.agreed) return setErr("Please confirm the declaration.");
    if (!headshotFile) return setErr("Upload a headshot photo.");
    if (!fullbodyFile) return setErr("Upload a full body photo.");
    if (!nrcFile) return setErr("Upload a copy of your NRC / passport / proof of age.");

    setUploading(true);
    try {
      const [headshot_url, fullbody_url, nrc_url, proof_url] = await Promise.all([
        uploadPublic(headshotFile),
        uploadPublic(fullbodyFile),
        uploadPublic(nrcFile),
        proofFile ? uploadPublic(proofFile) : Promise.resolve(""),
      ]);

      const roles = [
        ...form.agri_roles,
        ...(form.agri_role_other.trim() ? [`Other: ${form.agri_role_other.trim()}`] : []),
      ];

      m.mutate({
        data: {
          category: form.category as Category,
          full_name: form.full_name,
          date_of_birth: form.date_of_birth,
          nrc_number: form.nrc_number,
          gender: form.gender as Gender,
          phone: form.phone,
          email: form.email,
          province: form.province,
          occupation: form.occupation,
          agri_involved: form.agri_involved === "yes",
          agri_roles: roles,
          motivation: form.motivation,
          payment_method: form.payment_method as PayMethod,
          payment_reference: form.payment_reference,
          proof_url,
          headshot_url,
          fullbody_url,
          nrc_url,
          agreed: true as const,
        },
      });
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (done) {
    return (
      <main className="bg-background text-foreground">
        <section className="pt-36 pb-24 bg-green-deep text-ivory">
          <div className="container-luxe text-center max-w-2xl">
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-gold-soft to-gold-deep text-green-deep">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl">Application received</h1>
            <p className="mt-4 text-ivory/80">
              Thank you. Your application <strong>#{done.id}</strong> is now <strong>Pending</strong> review.
              We will contact you on the phone number and email you provided once a decision has been made.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link to="/contestant" className="px-6 py-3 rounded-full bg-gradient-to-r from-gold-soft via-gold to-gold-deep text-green-deep font-semibold text-sm">
                Back to contestants
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  const busy = uploading || m.isPending;

  return (
    <main className="bg-background text-foreground">
      <section className="relative pt-36 pb-12 md:pt-44 bg-green-deep text-ivory overflow-hidden">
        <div aria-hidden className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, color-mix(in oklab, var(--gold) 35%, transparent), transparent 55%), radial-gradient(circle at 85% 80%, color-mix(in oklab, var(--gold-deep) 25%, transparent), transparent 55%)" }} />
        <div className="container-luxe relative">
          <span className="text-[11px] tracking-[0.32em] uppercase text-gold-deep font-medium">MAZ 2027 · Online Application</span>
          <h1 className="font-display text-4xl md:text-6xl leading-[1.05] max-w-4xl mt-3">
            Miss &amp; Mister <span className="italic text-gradient-gold">Agriculture Zambia 2027</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/80">
            Applications open · Online · Mobile Money &amp; Bank Card accepted. A non-refundable application fee of <strong>K200</strong> confirms your entry.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[#F5F4EE]">
        <div className="container-luxe grid gap-8 lg:grid-cols-[1fr_360px]">
          <form onSubmit={onSubmit} className="space-y-6 order-2 lg:order-1">
            <Card title="Section 1 · Personal Details">
              <FormField label="Category" required>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(["Miss Agriculture Zambia", "Mister Agriculture Zambia"] as Category[]).map((c) => (
                    <label key={c} className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer text-sm ${form.category === c ? "border-[#1b4332] bg-[#1b4332]/5" : "border-[#1b4332]/15"}`}>
                      <input
                        type="radio"
                        name="category"
                        className="accent-[#1b4332]"
                        checked={form.category === c}
                        onChange={() => setForm({ ...form, category: c, gender: c.startsWith("Miss") ? "Female" : "Male" })}
                      />
                      {c}
                    </label>
                  ))}
                </div>
              </FormField>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Full names" required>
                  <Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                </FormField>
                <FormField label="Date of birth (18–35 years)" required>
                  <Input type="date" required value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
                </FormField>
                <FormField label="NRC / Passport number" required>
                  <Input required value={form.nrc_number} onChange={(e) => setForm({ ...form, nrc_number: e.target.value })} placeholder="e.g. 123456/78/1" />
                </FormField>
                <FormField label="Gender" required>
                  <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v as Gender })}>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Province / town" required>
                  <Select value={form.province} onValueChange={(v) => setForm({ ...form, province: v })}>
                    <SelectTrigger><SelectValue placeholder="Select province" /></SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField label="Phone / WhatsApp" required>
                  <Input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+260 ..." />
                </FormField>
                <FormField label="Email address" required>
                  <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </FormField>
                <FormField label="Occupation / school">
                  <Input value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} />
                </FormField>
              </div>
            </Card>

            <Card title="Section 2 · Agriculture Background">
              <p className="-mt-2 text-sm text-[#1b2a22]/60 italic">This is what MAZ is about 🌾</p>

              <FormField label="Are you involved in agriculture?" required>
                <div className="flex gap-3">
                  {(["yes", "no"] as const).map((v) => (
                    <label key={v} className={`flex items-center gap-2 rounded-lg border px-4 py-2 cursor-pointer text-sm capitalize ${form.agri_involved === v ? "border-[#1b4332] bg-[#1b4332]/5" : "border-[#1b4332]/15"}`}>
                      <input type="radio" name="agri_involved" className="accent-[#1b4332]" checked={form.agri_involved === v} onChange={() => setForm({ ...form, agri_involved: v })} />
                      {v}
                    </label>
                  ))}
                </div>
              </FormField>

              {form.agri_involved === "yes" && (
                <FormField label="If yes, tell us how (select all that apply)">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {ROLE_OPTIONS.map((r) => (
                      <label key={r} className={`flex items-center gap-2 rounded-lg border p-2.5 cursor-pointer text-sm ${form.agri_roles.includes(r) ? "border-[#1b4332] bg-[#1b4332]/5" : "border-[#1b4332]/15"}`}>
                        <Checkbox checked={form.agri_roles.includes(r)} onCheckedChange={() => toggleRole(r)} />
                        {r}
                      </label>
                    ))}
                  </div>
                  <Input
                    className="mt-3"
                    value={form.agri_role_other}
                    onChange={(e) => setForm({ ...form, agri_role_other: e.target.value })}
                    placeholder="Other (please specify)"
                  />
                </FormField>
              )}

              <FormField label="Short bio (150 words max)" required>
                <Textarea
                  required rows={6} maxLength={1200}
                  value={form.motivation}
                  onChange={(e) => setForm({ ...form, motivation: e.target.value })}
                  placeholder="Tell us who you are and your passion for Zambian agriculture…"
                />
              </FormField>
            </Card>

            <Card title="Section 3 · Uploads">
              <div className="grid gap-4 md:grid-cols-3">
                <FileField
                  label="Headshot photo"
                  hint="Clear, no filters, no sunglasses"
                  required
                  accept="image/*"
                  file={headshotFile}
                  onFile={setHeadshotFile}
                />
                <FileField
                  label="Full body photo"
                  hint="Smart casual or traditional wear"
                  required
                  accept="image/*"
                  file={fullbodyFile}
                  onFile={setFullbodyFile}
                />
                <FileField
                  label="Proof of age / NRC"
                  hint="JPG, PNG or PDF — max 8MB"
                  required
                  accept="image/*,application/pdf"
                  file={nrcFile}
                  onFile={setNrcFile}
                />
              </div>
            </Card>

            <Card title="Section 4 · Agreement & Payment">
              <FormField label="Application fee — K200" required>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(["Airtel Money", "MTN Money", "Bank Card"] as PayMethod[]).map((p) => (
                    <label key={p} className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer text-sm ${form.payment_method === p ? "border-[#1b4332] bg-[#1b4332]/5" : "border-[#1b4332]/15"}`}>
                      <input type="radio" name="pay" className="accent-[#1b4332]" checked={form.payment_method === p} onChange={() => setForm({ ...form, payment_method: p })} />
                      {p}
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-xs text-[#1b2a22]/60">Payment confirms your application.</p>
              </FormField>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Transaction reference (optional)">
                  <Input value={form.payment_reference} onChange={(e) => setForm({ ...form, payment_reference: e.target.value })} placeholder="e.g. AZ123456789" />
                </FormField>
                <FileField
                  label="Proof of payment (optional)"
                  hint="Screenshot or receipt"
                  accept="image/*,application/pdf"
                  file={proofFile}
                  onFile={setProofFile}
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer pt-2">
                <Checkbox checked={form.agreed} onCheckedChange={(v) => setForm({ ...form, agreed: v === true })} className="mt-1" />
                <span className="text-sm text-[#1b2a22]">
                  I confirm all info is true. I am <strong>18–35 years old</strong>, Zambian, and available for the
                  <strong> MAZ 2027 journey</strong>.
                </span>
              </label>
            </Card>

            {err && (
              <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</p>
            )}

            <div className="flex justify-end gap-3">
              <Link to="/contestant" className="inline-flex items-center px-5 py-3 rounded-full border border-[#1b4332]/20 text-sm text-[#1b2a22]">Cancel</Link>
              <Button type="submit" disabled={busy}
                className="bg-[#1b4332] hover:bg-[#163828] text-white rounded-full px-7 py-3 h-auto">
                {busy ? (<><Loader2 className="h-4 w-4 animate-spin mr-2" />Submitting…</>) : "Submit application"}
              </Button>
            </div>
          </form>

          <aside className="order-1 lg:order-2 space-y-4">
            <div className="rounded-2xl bg-green-deep text-ivory p-6 shadow-lg">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold-deep">Application fee</p>
              <p className="font-display text-4xl mt-1">K200</p>
              <p className="text-xs text-ivory/70 mt-1">Non-refundable · pay before submitting.</p>

              <h3 className="font-display text-lg mt-6 mb-2">Airtel Money / MTN Money</h3>
              <div className="rounded-lg bg-white/5 px-3">
                <CopyRow label="Name" value="Mubanga Musoma" />
                <CopyRow label="Mobile" value="0973470303" />
              </div>

              <h3 className="font-display text-lg mt-6 mb-2">Bank transfer</h3>
              <div className="rounded-lg bg-white/5 px-3">
                <CopyRow label="Bank" value="Access Bank Zambia Limited" />
                <CopyRow label="Account name" value="Mubanga Musoma" />
                <CopyRow label="Account number" value="0086459286010" />
                <CopyRow label="Currency" value="ZMW" />
                <CopyRow label="SWIFT" value="AZAMZMLU" />
              </div>

              <p className="mt-5 text-xs text-ivory/70">
                After paying, you can attach a screenshot as proof — optional but speeds up verification.
              </p>
            </div>
          </aside>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#1b4332]/10 bg-white p-6 shadow-sm space-y-4">
      <h2 className="font-display text-xl text-[#1b2a22]">{title}</h2>
      {children}
    </section>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs uppercase tracking-wider text-[#1b2a22]/60">
        {label}{required && <span className="ml-1 text-red-600">*</span>}
      </Label>
      {children}
    </div>
  );
}

function FileField({
  label, hint, required, accept, file, onFile,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  accept?: string;
  file: File | null;
  onFile: (f: File | null) => void;
}) {
  return (
    <FormField label={label} required={required}>
      <label className="flex items-center justify-center gap-2 cursor-pointer rounded-lg border-2 border-dashed border-[#1b4332]/25 bg-[#F5F4EE] px-4 py-6 text-sm text-[#1b2a22]/70 hover:bg-[#1b4332]/5 text-center">
        <UploadIcon className="h-4 w-4 shrink-0" />
        <span className="truncate">{file ? file.name : "Click to upload"}</span>
        <input
          type="file"
          accept={accept ?? "image/*"}
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
      </label>
      {hint && <p className="mt-1 text-xs text-[#1b2a22]/60">{hint}</p>}
      {file && <p className="mt-1 text-xs text-[#1b2a22]/60">{(file.size / 1024).toFixed(0)} KB</p>}
    </FormField>
  );
}
