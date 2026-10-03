/**
 * Firestore Public Content Service
 *
 * Handles read-only public content queries:
 * - Legal Professionals (published/verified)
 * - Practice Areas (active)
 * - Legal Services (active)
 * - Articles/Insights (published)
 * - FAQs (active)
 * - Testimonials (active)
 *
 * All queries use Firestore one-time reads (not realtime listeners)
 * since public content changes infrequently.
 *
 * Security: All these collections are readable without authentication
 * (for published/active documents only) per Firestore Security Rules.
 */

import { Injectable, inject, signal } from '@angular/core';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from './firebase.app';
import {
  FirestoreProfessional,
  FirestorePracticeArea,
  FirestoreLegalService,
  FirestoreArticle,
  FirestoreFaq,
  FirestoreTestimonial,
  COLLECTIONS
} from './firestore.types';
import { LegalProfessional } from '../models/legal-professional.model';
import { LegalService } from '../models/legal-service.model';
import { mapFirebaseError } from './firebase-error.handler';

@Injectable({ providedIn: 'root' })
export class FirestorePublicService {
  private readonly db = inject(FIREBASE_FIRESTORE);

  // Signals for public content
  private readonly _professionals = signal<LegalProfessional[]>([]);
  private readonly _services = signal<LegalService[]>([]);
  private readonly _articles = signal<FirestoreArticle[]>([]);
  private readonly _faqs = signal<FirestoreFaq[]>([]);
  private readonly _testimonials = signal<FirestoreTestimonial[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  public readonly professionals = this._professionals.asReadonly();
  public readonly services = this._services.asReadonly();
  public readonly articles = this._articles.asReadonly();
  public readonly faqs = this._faqs.asReadonly();
  public readonly testimonials = this._testimonials.asReadonly();
  public readonly isLoading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();

  // ─────────────────────────────────────────────────────────
  // PROFESSIONALS
  // ─────────────────────────────────────────────────────────

  public async loadVerifiedProfessionals(): Promise<void> {
    this._loading.set(true);
    try {
      const q = query(
        collection(this.db, COLLECTIONS.PROFESSIONALS),
        where('isVerified', '==', true),
        where('isProfileVisible', '==', true),
        orderBy('rating', 'desc')
      );
      const snap = await getDocs(q);
      const profs = snap.docs.map(d => this.mapProfessional(d.id, d.data() as FirestoreProfessional));
      this._professionals.set(profs);
    } catch (err) {
      const mapped = mapFirebaseError(err);
      this._error.set(mapped.userMessage);
      console.error('[PublicService] loadVerifiedProfessionals:', err);
    } finally {
      this._loading.set(false);
    }
  }

  public async getProfessionalBySlug(slug: string): Promise<LegalProfessional | null> {
    try {
      const q = query(
        collection(this.db, COLLECTIONS.PROFESSIONALS),
        where('slug', '==', slug),
        where('isVerified', '==', true),
        limit(1)
      );
      const snap = await getDocs(q);
      if (snap.empty) return null;
      const d = snap.docs[0];
      return this.mapProfessional(d.id, d.data() as FirestoreProfessional);
    } catch (err) {
      console.error('[PublicService] getProfessionalBySlug:', err);
      return null;
    }
  }

  // ─────────────────────────────────────────────────────────
  // LEGAL SERVICES
  // ─────────────────────────────────────────────────────────

  public async loadActiveServices(): Promise<void> {
    this._loading.set(true);
    try {
      const q = query(
        collection(this.db, COLLECTIONS.LEGAL_SERVICES),
        where('isActive', '==', true),
        orderBy('isPopular', 'desc')
      );
      const snap = await getDocs(q);
      const services = snap.docs.map(d => this.mapService(d.id, d.data() as FirestoreLegalService));
      this._services.set(services);
    } catch (err) {
      const mapped = mapFirebaseError(err);
      this._error.set(mapped.userMessage);
    } finally {
      this._loading.set(false);
    }
  }

  // ─────────────────────────────────────────────────────────
  // ARTICLES / INSIGHTS
  // ─────────────────────────────────────────────────────────

  public async loadPublishedArticles(limitCount = 10): Promise<void> {
    this._loading.set(true);
    try {
      const q = query(
        collection(this.db, COLLECTIONS.ARTICLES),
        where('status', '==', 'PUBLISHED'),
        orderBy('publishedAt', 'desc'),
        limit(limitCount)
      );
      const snap = await getDocs(q);
      const articles = snap.docs.map(d => ({ id: d.id, ...d.data() } as FirestoreArticle & { id: string }));
      this._articles.set(articles as FirestoreArticle[]);
    } catch (err) {
      console.error('[PublicService] loadPublishedArticles:', err);
    } finally {
      this._loading.set(false);
    }
  }

  public async getArticleBySlug(slug: string): Promise<(FirestoreArticle & { id: string }) | null> {
    try {
      const q = query(
        collection(this.db, COLLECTIONS.ARTICLES),
        where('slug', '==', slug),
        where('status', '==', 'PUBLISHED'),
        limit(1)
      );
      const snap = await getDocs(q);
      if (snap.empty) return null;
      return { id: snap.docs[0].id, ...snap.docs[0].data() } as FirestoreArticle & { id: string };
    } catch (err) {
      console.error('[PublicService] getArticleBySlug:', err);
      return null;
    }
  }

  // ─────────────────────────────────────────────────────────
  // FAQs
  // ─────────────────────────────────────────────────────────

  public async loadActiveFaqs(): Promise<void> {
    try {
      const q = query(
        collection(this.db, COLLECTIONS.FAQS),
        where('isActive', '==', true),
        orderBy('order', 'asc')
      );
      const snap = await getDocs(q);
      this._faqs.set(snap.docs.map(d => d.data() as FirestoreFaq));
    } catch (err) {
      console.error('[PublicService] loadActiveFaqs:', err);
    }
  }

  // ─────────────────────────────────────────────────────────
  // TESTIMONIALS
  // ─────────────────────────────────────────────────────────

  public async loadActiveTestimonials(): Promise<void> {
    try {
      const q = query(
        collection(this.db, COLLECTIONS.TESTIMONIALS),
        where('isActive', '==', true),
        orderBy('order', 'asc')
      );
      const snap = await getDocs(q);
      this._testimonials.set(snap.docs.map(d => d.data() as FirestoreTestimonial));
    } catch (err) {
      console.error('[PublicService] loadActiveTestimonials:', err);
    }
  }

  // ─────────────────────────────────────────────────────────
  // MAPPERS
  // ─────────────────────────────────────────────────────────

  private mapProfessional(id: string, data: FirestoreProfessional): LegalProfessional {
    return {
      id,
      slug: data.slug,
      fullName: data.fullName,
      title: data.title,
      barLicenseNumber: data.barLicenseNumber,
      avatarUrl: data.avatarUrl ?? '',
      bio: data.bio,
      locationCity: data.locationCity,
      yearsOfExperience: data.yearsOfExperience,
      rating: data.rating,
      reviewCount: data.reviewCount,
      consultationFee: data.consultationFee,
      specializations: data.specializations,
      education: data.education,
      languages: data.languages,
      isVerified: data.isVerified,
      isAvailableToday: data.isAvailableToday,
      officeAddress: data.officeAddress,
      casesCompleted: data.casesCompleted,
    };
  }

  private mapService(id: string, data: FirestoreLegalService): LegalService {
    return {
      id,
      slug: data.slug,
      title: data.title,
      categorySlug: data.practiceAreaId,
      categoryName: data.practiceAreaName,
      summary: data.summary,
      description: data.description,
      iconName: data.iconName,
      startingPrice: data.startingPrice,
      priceUnit: data.priceUnit,
      estimatedDuration: data.estimatedDuration,
      keyFeatures: data.keyFeatures,
      deliverables: data.deliverables,
      recommendedFor: data.recommendedFor,
      isPopular: data.isPopular,
    };
  }
}
