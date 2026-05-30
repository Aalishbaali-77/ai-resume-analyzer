import { create } from "zustand";
import { supabase } from "~/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface ResumeRecord {
    id: string;
    user_id: string;
    company_name: string | null;
    job_title: string | null;
    job_description: string | null;
    resume_path: string;
    image_path: string;
    feedback: Feedback | null;
    created_at: string;
}

interface SupabaseStore {
    isLoading: boolean;
    error: string | null;
    auth: {
        user: User | null;
        isAuthenticated: boolean;
        signIn: () => Promise<void>;
        signOut: () => Promise<void>;
        refreshUser: () => Promise<void>;
        checkAuthStatus: () => Promise<boolean>;
        getUser: () => User | null;
    };
    fs: {
        upload: (
            file: File,
            bucket: "resumes" | "resume-images"
        ) => Promise<{ path: string; url: string } | undefined>;
        getSignedUrl: (path: string) => Promise<string | undefined>;
        delete: (bucket: string, path: string) => Promise<void>;
    };
    db: {
        saveResume: (
            data: Omit<ResumeRecord, "id" | "created_at" | "user_id">
        ) => Promise<string | undefined>;
        getResume: (id: string) => Promise<ResumeRecord | undefined>;
        listResumes: () => Promise<ResumeRecord[]>;
        updateFeedback: (id: string, feedback: Feedback) => Promise<void>;
        deleteResume: (id: string) => Promise<void>;
    };
    init: () => void;
    clearError: () => void;
}

export const useSupabaseStore = create<SupabaseStore>((set, get) => {
    const setError = (msg: string) => {
        console.error("[SupabaseStore]", msg);
        set({ error: msg, isLoading: false });
    };

    const checkAuthStatus = async (): Promise<boolean> => {
        set({ isLoading: true, error: null });
        try {
            const { data, error } = await supabase.auth.getSession();
            if (error) throw error;
            const user = data.session?.user ?? null;
            set({
                auth: {
                    ...get().auth,
                    user,
                    isAuthenticated: !!user,
                    getUser: () => user,
                },
                isLoading: false,
            });
            return !!user;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to check auth");
            return false;
        }
    };

    const signIn = async (): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "github",
                options: { redirectTo: window.location.origin },
            });
            if (error) throw error;
        } catch (err) {
            setError(err instanceof Error ? err.message : "Sign in failed");
        }
    };

    const signOut = async (): Promise<void> => {
        set({ isLoading: true, error: null });
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            set({
                auth: {
                    ...get().auth,
                    user: null,
                    isAuthenticated: false,
                    getUser: () => null,
                },
                isLoading: false,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Sign out failed");
        }
    };

    const refreshUser = async (): Promise<void> => {
        await checkAuthStatus();
    };

    const uploadFile = async (
        file: File,
        bucket: "resumes" | "resume-images"
    ): Promise<{ path: string; url: string } | undefined> => {
        const user = get().auth.user;
        if (!user) {
            setError("Not authenticated");
            return;
        }
        const ext = file.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error } = await supabase.storage
            .from(bucket)
            .upload(path, file, { upsert: false });
        if (error) {
            setError(`Upload failed: ${error.message}`);
            return;
        }
        if (bucket === "resume-images") {
            const { data } = supabase.storage.from(bucket).getPublicUrl(path);
            return { path, url: data.publicUrl };
        } else {
            const { data, error: signedErr } = await supabase.storage
                .from(bucket)
                .createSignedUrl(path, 60 * 60);
            if (signedErr) {
                setError(`Signed URL failed: ${signedErr.message}`);
                return;
            }
            return { path, url: data.signedUrl };
        }
    };

    const getSignedUrl = async (path: string): Promise<string | undefined> => {
        const { data, error } = await supabase.storage
            .from("resumes")
            .createSignedUrl(path, 60 * 60);
        if (error) {
            setError(error.message);
            return;
        }
        return data.signedUrl;
    };

    const deleteFile = async (bucket: string, path: string): Promise<void> => {
        const { error } = await supabase.storage.from(bucket).remove([path]);
        if (error) setError(error.message);
    };

    const saveResume = async (
        data: Omit<ResumeRecord, "id" | "created_at" | "user_id">
    ): Promise<string | undefined> => {
        const user = get().auth.user;
        console.log("saveResume called, user:", user);
        if (!user) {
            setError("Not authenticated");
            console.error("No user found when saving resume");
            return;
        }
        const { data: row, error } = await supabase
            .from("resumes")
            .insert({ ...data, user_id: user.id })
            .select("id")
            .single();
        if (error) {
            setError(error.message);
            console.error("Supabase insert error:", error);
            return;
        }
        return row.id;
    };
    const getResume = async (id: string): Promise<ResumeRecord | undefined> => {
        const { data, error } = await supabase
            .from("resumes")
            .select("*")
            .eq("id", id)
            .single();
        if (error) {
            setError(error.message);
            return;
        }
        return data as ResumeRecord;
    };

    const listResumes = async (): Promise<ResumeRecord[]> => {
        const { data, error } = await supabase
            .from("resumes")
            .select("*")
            .order("created_at", { ascending: false });
        if (error) {
            setError(error.message);
            return [];
        }
        return (data ?? []) as ResumeRecord[];
    };

    const updateFeedback = async (
        id: string,
        feedback: Feedback
    ): Promise<void> => {
        const { error } = await supabase
            .from("resumes")
            .update({ feedback })
            .eq("id", id);
        if (error) setError(error.message);
    };

    const deleteResume = async (id: string): Promise<void> => {
        const { error } = await supabase.from("resumes").delete().eq("id", id);
        if (error) setError(error.message);
    };

    const init = (): void => {
        checkAuthStatus();
        supabase.auth.onAuthStateChange((_event, session) => {
            const user = session?.user ?? null;
            set({
                auth: {
                    ...get().auth,
                    user,
                    isAuthenticated: !!user,
                    getUser: () => user,
                },
                isLoading: false,
            });
        });
    };

    return {
        isLoading: true,
        error: null,
        auth: {
            user: null,
            isAuthenticated: false,
            signIn,
            signOut,
            refreshUser,
            checkAuthStatus,
            getUser: () => get().auth.user,
        },
        fs: {
            upload: uploadFile,
            getSignedUrl,
            delete: deleteFile,
        },
        db: {
            saveResume,
            getResume,
            listResumes,
            updateFeedback,
            deleteResume,
        },
        init,
        clearError: () => set({ error: null }),
    };
});