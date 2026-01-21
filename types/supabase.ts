export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    role: 'student' | 'admin'
                    full_name: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    role?: 'student' | 'admin'
                    full_name?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    role?: 'student' | 'admin'
                    full_name?: string | null
                    created_at?: string
                }
            }
            subjects: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    created_at?: string
                }
            }
            subscriptions: {
                Row: {
                    id: string
                    user_id: string
                    subject_id: string
                    month: number
                    year: number
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    subject_id: string
                    month: number
                    year: number
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    subject_id?: string
                    month?: number
                    year?: number
                    is_active?: boolean
                    created_at?: string
                }
            }
            videos: {
                Row: {
                    id: string
                    subject_id: string
                    title: string
                    youtube_url: string | null
                    video_path: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    subject_id: string
                    title: string
                    youtube_url?: string | null
                    video_path?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    subject_id?: string
                    title?: string
                    youtube_url?: string | null
                    video_path?: string | null
                    created_at?: string
                }
            }
            quizzes: {
                Row: {
                    id: string
                    subject_id: string
                    title: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    subject_id: string
                    title: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    subject_id?: string
                    title?: string
                    created_at?: string
                }
            }
            questions: {
                Row: {
                    id: string
                    quiz_id: string
                    question: string
                    option_a: string
                    option_b: string
                    option_c: string
                    option_d: string
                    correct_answer: 'a' | 'b' | 'c' | 'd'
                    created_at: string
                }
                Insert: {
                    id?: string
                    quiz_id: string
                    question: string
                    option_a: string
                    option_b: string
                    option_c: string
                    option_d: string
                    correct_answer: 'a' | 'b' | 'c' | 'd'
                    created_at?: string
                }
                Update: {
                    id?: string
                    quiz_id?: string
                    question?: string
                    option_a?: string
                    option_b?: string
                    option_c?: string
                    option_d?: string
                    correct_answer?: 'a' | 'b' | 'c' | 'd'
                    created_at?: string
                }
            }
            results: {
                Row: {
                    id: string
                    user_id: string
                    quiz_id: string
                    score: number
                    total_questions: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    quiz_id: string
                    score: number
                    total_questions: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    quiz_id?: string
                    score?: number
                    total_questions?: number
                    created_at?: string
                }
            }
        }
    }
}
