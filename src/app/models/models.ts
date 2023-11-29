export interface Curso {
    name: string;
    seccion: string;
    image: string;
    sala: string;
    id: string;
    userId: User[];
    alumnos: User[]; 
    profesor: User;
}

export interface User{
    uid: string,
    email: string,
    password: string,
    name: string,
    image: string,
    profile: 'alumno' | 'profesor' | 'admin'
}

