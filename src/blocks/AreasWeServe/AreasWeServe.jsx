import styles from './AreasWeServe.module.css';
import { getAllCities } from '@/lib/strapi';
import Link from 'next/link';

export default async function AreasWeServe() {
    let cities = [];
    try {
        cities = await getAllCities();
    } catch (error) {
        console.error('[AreasWeServe] Failed to fetch cities:', error);
    }

    // Filter and sort cities
    const activeCities = cities
        .filter(city => !city.test_version && city.path && city.city_name && !city.metro_city_slug)
        .sort((a, b) => a.city_name.localeCompare(b.city_name));

    // Ensure Chicago is included (if not already in Strapi with a path)
    const hasChicago = activeCities.some(c => c.path === 'chicago');
    
    return (
        <section className={styles.areasSection}>
            <div className={styles.container}>
                <h2 className={styles.title}>Areas We Serve</h2>
                <div className={styles.grid}>
                    {!hasChicago && (
                        <Link href="/chicago/" className={styles.cityLink}>
                            Chicago, IL
                        </Link>
                    )}
                    {activeCities.map((city) => (
                        <Link 
                            key={city.id} 
                            href={`/${city.path}/`} 
                            className={styles.cityLink}
                        >
                            {city.city_name}{city.state_code ? `, ${city.state_code}` : ''}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
