import * as React from 'react';
import { algoliasearch } from 'algoliasearch';
import { Combobox, ComboboxOption } from '@strapi/design-system';
import { SearchResponse } from '@algolia/client-search';

interface Product {
  name: string;
  id: string;
  brand: string;
  image: string;
}

const appID = process.env.STRAPI_ADMIN_ALGOLIA_APP_ID || '';
const apiKey = process.env.STRAPI_ADMIN_ALGOLIA_API_KEY || '';
const indexName = 'products';

const client = algoliasearch(appID, apiKey);

function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface InputProps {
  name: string;
  value: string;
  onChange: (event: { target: { name: string; type: string; value: string } }) => void;
  required?: boolean;
  disabled?: boolean;
  label?: string;
}

const Input = React.forwardRef<HTMLSelectElement, InputProps>((props, ref) => {
  const { name, value, onChange, required, disabled, label } = props;
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleChange = (value: any) => {
    onChange({
      target: { name, type: 'customField', value: JSON.stringify(value) },
    });
  };

  const fetchProducts = async (query: string) => {
    setLoading(true);
    try {
      const { results } = await client.search<Product>({
        requests: [
          {
            indexName,
            query,
            params:
              'attributesToRetrieve=name,id,brand,image&restrictSearchableAttributes=name&hitsPerPage=10&queryType=prefixLast',
          },
        ],
      });

      const searchResults = results[0] as SearchResponse<Product>;
      const filteredResults = searchResults.hits.filter((hit) =>
        hit.name.toLowerCase().includes(query.toLowerCase())
      );
      setProducts(filteredResults);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchProducts = React.useMemo(() => debounce(fetchProducts, 300), []);

  return (
    <div>
      <Combobox
        ref={ref}
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        autoComplete="off"
        onInputChange={(e: any) => {
          debouncedFetchProducts(e.target.value);
        }}
        label={label || 'Search products'}
        placeholder={value ? JSON.parse(value)?.name : 'Type to search products...'}
        loading={loading}
        onChange={(e: any) => {
          handleChange(e);
        }}
      >
        {products.map((product: Product) => (
          <ComboboxOption
            key={product.id}
            value={{
              id: product.id,
              name: product.name,
              brand: product.brand,
              image: product.image,
            }}
          >
            {product.name.replace(/-/g, ' ').replace(/\b\w/g, (l: any) => l.toUpperCase())}
          </ComboboxOption>
        ))}
      </Combobox>
    </div>
  );
});

export default Input;
