import Link from 'next/link';
import { getCategory } from '@/lib/categories';
import { tiersFor } from '@/lib/pricing';
import type { Product } from '@/lib/types';
import { Art } from './Art';
import { Price } from './Price';

export function ProductCard({ product }: { product: Product }) {
  const cat = getCategory(product.category);
  const v = product.variants[0];
  const tiers = tiersFor(product);
  const best = tiers[tiers.length - 1];
  const interval = v.interval ? (v.interval === 'year' ? '/ year' : '/ month') : '';
  return (
    <Link href={`/products/${product.handle}`} className="product-card">
      <div className="product-card__art">
        {product.image
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <Art art={cat?.art ?? 'marker'} seed={product.handle} label={product.title} />}
        {product.kind === 'licence' && <span className="product-card__badge">Digital delivery</span>}
      </div>
      <div className="product-card__body">
        <span className="product-card__sku">{product.sku}</span>
        <h3 className="product-card__title">{product.title}</h3>
        <div className="product-card__foot">
          <div className="product-card__price">
            <Price money={v.price} />
            <small>{product.kind === 'licence' ? `per seat ${interval}` : 'excl. tax'}</small>
          </div>
          {best.discount > 0 && <div className="product-card__tier">Save {Math.round(best.discount * 100)}%<br />on {best.min}+</div>}
        </div>
      </div>
    </Link>
  );
}
