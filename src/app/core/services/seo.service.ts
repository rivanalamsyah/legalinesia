import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoMetadata {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  canonicalUrl?: string;
  robots?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  private readonly siteName = 'Legalinesia';
  private readonly siteUrl = 'https://legalinesia.id';
  private readonly defaultTitle = 'Legalinesia - Platform Konsultasi Hukum & Direktori Advokat Terpercaya';
  private readonly defaultDescription = 'Hubungkan kebutuhan hukum Anda dengan advokat berlisensi PERADI dan konsultan hukum berpengalaman di Indonesia. Konsultasi instan, transparan, dan aman.';
  private readonly defaultKeywords = ['konsultasi hukum', 'advokat indonesia', 'pengacara jakarta', 'pendirian PT', 'hukum keluarga', 'sengketa bisnis', 'kontrak bisnis'];

  public updateSeo(meta: SeoMetadata): void {
    const fullTitle = meta.title 
      ? (meta.title.includes(this.siteName) ? meta.title : `${meta.title} | ${this.siteName}`)
      : this.defaultTitle;

    this.titleService.setTitle(fullTitle);

    const description = meta.description || this.defaultDescription;
    const keywords = meta.keywords ? meta.keywords.join(', ') : this.defaultKeywords.join(', ');
    const ogImage = meta.ogImage || `${this.siteUrl}/assets/images/og-legalinesia.jpg`;
    const ogType = meta.ogType || 'website';
    const canonical = meta.canonicalUrl || (typeof window !== 'undefined' ? window.location.href : this.siteUrl);
    const robots = meta.robots || 'index, follow';

    // Meta tags
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ name: 'keywords', content: keywords });
    this.metaService.updateTag({ name: 'robots', content: robots });

    // Open Graph
    this.metaService.updateTag({ property: 'og:site_name', content: this.siteName });
    this.metaService.updateTag({ property: 'og:title', content: fullTitle });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:type', content: ogType });
    this.metaService.updateTag({ property: 'og:image', content: ogImage });
    this.metaService.updateTag({ property: 'og:url', content: canonical });

    // Twitter Card
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: fullTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image', content: ogImage });

    // Update Canonical Tag
    this.setCanonicalUrl(canonical);

    // Default Organization Schema
    this.setOrganizationSchema();
  }

  public setCanonicalUrl(url: string): void {
    if (typeof document === 'undefined') return;
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  public setStructuredData(data: object): void {
    if (typeof document === 'undefined') return;
    
    let script = document.getElementById('json-ld-script') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = 'json-ld-script';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }

  public setOrganizationSchema(): void {
    const orgSchema = {
      '@context': 'https://schema.org',
      '@type': 'LegalService',
      'name': 'Legalinesia Indonesia',
      'url': this.siteUrl,
      'logo': `${this.siteUrl}/assets/images/logo.png`,
      'description': this.defaultDescription,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Sequis Tower Lt. 18, Jl. Jend. Sudirman Kav. 71',
        'addressLocality': 'Jakarta Selatan',
        'addressRegion': 'DKI Jakarta',
        'postalCode': '12190',
        'addressCountry': 'ID'
      },
      'telephone': '+62-21-5088-9900',
      'priceRange': '$$'
    };
    this.setStructuredData(orgSchema);
  }

  public setFaqPageSchema(faqs: { title: string; content: string }[]): void {
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(f => ({
        '@type': 'Question',
        'name': f.title,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': f.content
        }
      }))
    };
    this.setStructuredData(faqSchema);
  }
}
