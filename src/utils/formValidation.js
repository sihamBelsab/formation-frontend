import { z } from 'zod';

// Simple Formation validation schema with all required fields
export const formationSchema = z.object({
  id_formation: z.number().optional(),
  idbes: z.string().min(1, 'Besoin de formation est requis'),
  categorie: z.enum(['metier', 'transverse', 'ordre légale'], {
    errorMap: () => ({ message: 'Catégorie est requise' }),
  }),
  type: z.enum(['interne', 'externe'], {
    errorMap: () => ({ message: 'Type est requis' }),
  }),
  date_debut: z.string().min(1, 'Date début est requise'),
  date_fin: z.string().min(1, 'Date fin est requise'),
  theme: z.string().min(1, 'Thème est requis'),
  id: z.string().min(1, 'Organisme est requis'),
  idformateur: z.string().min(1, 'Formateur est requis'),
  etat: z.string().min(1, 'État est requis'),
});

// User validation schema
export const userSchema = z.object({
  nom: z.string().min(1, 'Nom est requis').min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z
    .string()
    .min(1, 'Prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères'),
  tel: z
    .string()
    .min(1, 'Téléphone est requis')
    .regex(/^\d{10}$/, 'Le téléphone doit contenir exactement 10 chiffres'),
  email: z.string().min(1, 'Email est requis').email('Format email invalide'),
  matricule: z
    .string()
    .min(1, 'Matricule est requis')
    .regex(/^\d{6}$/, 'Le matricule doit contenir exactement 6 chiffres'),
  mot_de_pass: z
    .string()
    .min(1, 'Mot de passe est requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(
    [
      'admin',
      'directeur_general',
      'employe',
      'service_formation',
      'directeur_rh',
      'responsable_direction',
    ],
    {
      errorMap: () => ({ message: 'Rôle est requis' }),
    }
  ),
  status: z.enum(['actif', 'inactif'], {
    errorMap: () => ({ message: 'Statut est requis' }),
  }),
});

// User update validation schema (password is optional for updates)
export const userUpdateSchema = z
  .object({
    nom: z.string().min(1, 'Nom est requis').min(2, 'Le nom doit contenir au moins 2 caractères'),
    prenom: z
      .string()
      .min(1, 'Prénom est requis')
      .min(2, 'Le prénom doit contenir au moins 2 caractères'),
    tel: z
      .string()
      .min(1, 'Téléphone est requis')
      .regex(/^\d{10}$/, 'Le téléphone doit contenir exactement 10 chiffres'),
    email: z.string().min(1, 'Email est requis').email('Format email invalide'),
    matricule: z
      .string()
      .min(1, 'Matricule est requis')
      .regex(/^\d{6}$/, 'Le matricule doit contenir exactement 6 chiffres'),
    mot_de_pass: z.string().optional(),
    role: z.enum(
      [
        'admin',
        'directeur_general',
        'employe',
        'service_formation',
        'directeur_rh',
        'responsable_direction',
      ],
      {
        errorMap: () => ({ message: 'Rôle est requis' }),
      }
    ),
    status: z.enum(['actif', 'inactif'], {
      errorMap: () => ({ message: 'Statut est requis' }),
    }),
    changePassword: z.boolean().optional(),
  })
  .refine(
    data => {
      // If changePassword is true, password is required
      if (data.changePassword && (!data.mot_de_pass || data.mot_de_pass.length < 6)) {
        return false;
      }
      return true;
    },
    {
      message: 'Le mot de passe est requis et doit contenir au moins 6 caractères',
      path: ['mot_de_pass'],
    }
  );

// Trainer validation schema
export const trainerSchema = z.object({
  idformateur: z.coerce.number().optional(),
  nom: z.string().min(1, 'Le nom est requis').min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z
    .string()
    .min(1, 'Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères'),
  email: z.string().min(1, "L'email est requis").email('Format email invalide'),
  telephone: z
    .string()
    .min(1, 'Le téléphone est requis')
    .regex(/^\d{10}$/, 'Le téléphone doit contenir exactement 10 chiffres'),
});

// Employee validation schema
export const employeeSchema = z.object({
  matricule: z.number(),

  grade: z
    .string()
    .min(1, 'Le grade est requis')
    .refine(val => ['Execution', 'Maitrise', 'Cadre'].includes(val), {
      message: 'Veuillez sélectionner un grade valide',
    }),
  id_direction: z.string().min(1, 'La direction est requise'),
  id_poste: z.string().min(1, 'Le poste est requis'),
});

// Direction validation schema
export const directionSchema = z.object({
  direction: z
    .string()
    .min(1, 'Le nom de la direction est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne doit pas dépasser 100 caractères'),
});

// Position validation schema
export const positionSchema = z.object({
  poste: z
    .string()
    .min(1, 'Le nom du poste est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne doit pas dépasser 100 caractères'),
});

// Training Need validation schema
export const trainingNeedSchema = z
  .object({
    titre: z
      .string()
      .min(1, 'Le titre est requis')
      .min(2, 'Le titre doit contenir au moins 2 caractères')
      .max(200, 'Le titre ne doit pas dépasser 200 caractères'),
    objectif: z
      .string()
      .min(1, "L'objectif est requis")
      .min(10, "L'objectif doit contenir au moins 10 caractères")
      .max(1000, "L'objectif ne doit pas dépasser 1000 caractères"),
    dateSouhaitee: z.string().min(1, 'La date souhaitée est requise'),
    priorite: z.enum(['Elevée', 'Moyenne', 'Faible'], {
      errorMap: () => ({ message: 'La priorité est requise' }),
    }),
    id_direction: z.string().min(1, 'La direction est requise'),
  })
  .refine(
    data => {
      // Validate that desired date is not in the past
      if (data.dateSouhaitee) {
        const desiredDate = new Date(data.dateSouhaitee);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return desiredDate >= today;
      }
      return true;
    },
    {
      message: 'La date souhaitée ne peut pas être dans le passé',
      path: ['dateSouhaitee'],
    }
  );

// Location/Organization validation schema
export const locationSchema = z.object({
  libelle: z
    .string()
    .min(1, 'Le libellé est requis')
    .min(2, 'Le libellé doit contenir au moins 2 caractères')
    .max(200, 'Le libellé ne doit pas dépasser 200 caractères'),
  numtel: z
    .string()
    .min(1, 'Le numéro de téléphone est requis')
    .regex(/^\d{10}$/, 'Le numéro de téléphone doit contenir exactement 10 chiffres'),
  adresse: z
    .string()
    .min(1, "L'adresse est requise")
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .max(500, "L'adresse ne doit pas dépasser 500 caractères"),
  budget: z
    .string()
    .min(1, 'Le budget est requis')
    .refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Le budget doit être un nombre positif',
    }),
});

// Evaluation validation schema
export const evaluationChaudSchema = z.object({
  formation: z
    .array(z.any())
    .min(1, 'Veuillez sélectionner une formation')
    .refine(formations => formations.length > 0, {
      message: 'Une formation doit être sélectionnée',
    }),
});

// Plan creation validation schema
export const createPlanSchema = z.object({
  annee: z.coerce
    .number()
    .min(new Date().getFullYear(), "L'année doit être l'année actuelle ou future")
    .max(new Date().getFullYear() + 10, "L'année ne peut pas dépasser 10 ans dans le futur"),
  notes: z.string().optional(),
});
