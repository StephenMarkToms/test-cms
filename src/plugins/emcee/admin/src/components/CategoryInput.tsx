import * as React from 'react';
import { algoliasearch } from 'algoliasearch';
import { Combobox, ComboboxOption } from '@strapi/design-system';
import { SearchResponse } from '@algolia/client-search';

interface Product {
  name: string;
  id: string;
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
  const [categories, setCategories] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleChange = (value: any) => {
    onChange({
      target: { name, type: 'customField', value: JSON.stringify(value) },
    });
  };

  const fetchCategories = async (query: string) => {
    setLoading(true);
    try {
      const { facetHits } = await client.searchForFacetValues({
        indexName,
        facetName: 'aiCategory',
      });

      const filteredResults = facetHits.filter((hit) =>
        hit.value.toLowerCase().includes(query.toLowerCase())
      );
      setCategories(filteredResults.map((hit) => hit.value));
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  async function getFacetOptions(facet: string) {
    const response = await client.searchForFacetValues({
      indexName,
      facetName: facet,
    });

    return response.facetHits.map((hit) => hit.value);
  }

  getFacetOptions('aiCategory').then(console.log);

  const debouncedFetchCategories = React.useMemo(() => debounce(fetchCategories, 300), []);

  return (
    <div className="sc-Qotzb jopkZf sc-fYsHOw chVHzE">
      <label className="sc-Qotzb jopkZf sc-dKREkF dyihFP sc-bmCFzp dngdFz">
        {label || 'Search products'}
      </label>
      <Combobox
        ref={ref}
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        autoComplete="off"
        onInputChange={(e: any) => {
          debouncedFetchCategories(e.target.value);
        }}
        label={label || 'Search categories'}
        placeholder={value ? JSON.parse(value)?.name : ''}
        loading={loading}
        onChange={(e: any) => {
          console.log('e', e);
          handleChange(e);
        }}
      >
        {categories.map((category: any) => (
          <ComboboxOption
            key={category}
            value={{
              id: category,
              name: category,
            }}
          >
            {category.replace(/-/g, ' ').replace(/\b\w/g, (l: any) => l.toUpperCase())}
          </ComboboxOption>
        ))}
      </Combobox>
    </div>
  );
});

export default Input;
