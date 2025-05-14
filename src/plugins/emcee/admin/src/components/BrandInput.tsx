import * as React from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { Combobox, ComboboxOption, Checkbox } from '@strapi/design-system';
import { useEffect } from 'react';
const client = new ApolloClient({
  uri: `${process.env.STRAPI_ADMIN_BFF_URL}/graphql`, // Change this to your actual GraphQL endpoint
  cache: new InMemoryCache(),
});

const GET_BRANDS = gql`
  query getMerchants($input: String!) {
    allMerchants(filter: { displayName: { includesInsensitive: $input } }) {
      edges {
        node {
          id
          displayName
        }
      }
    }
  }
`;

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
  const [brands, setBrands] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedBrands, setSelectedBrands] = React.useState<any[]>(value ? JSON.parse(value) : []);

  const handleChange = (value: any) => {
    if (!selectedBrands.some((brand) => brand.id === value.id)) {
      setSelectedBrands([...selectedBrands, value]);
    }
  };

  useEffect(() => {
    onChange({
      target: { name, type: 'customField', value: JSON.stringify(selectedBrands) },
    });
  }, [selectedBrands]);

  const fetchBrands = async (query: string) => {
    if (!query) return;

    setLoading(true);
    try {
      const result = await client.query({
        query: GET_BRANDS,
        variables: { input: query },
      });

      const nodes = result.data?.allMerchants?.edges?.map((edge: any) => edge.node) || [];
      setBrands(nodes);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchBrands = React.useMemo(() => debounce(fetchBrands, 300), []);

  return (
    <div className="sc-Qotzb jopkZf sc-fYsHOw chVHzE">
      <label className="sc-Qotzb jopkZf sc-dKREkF dyihFP sc-bmCFzp dngdFz">
        {label || 'Search brands'}
      </label>
      {selectedBrands?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 10 }}>
          {selectedBrands.map((brand: any) => (
            <div key={brand.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Checkbox
                key={brand.id}
                label={brand.name}
                name={brand.name}
                checked={selectedBrands.length > 0}
                onClick={() => {
                  setSelectedBrands(selectedBrands.filter((b) => b.id !== brand.id));
                }}
              />
              <div>{brand.name}</div>
            </div>
          ))}
        </div>
      )}
      <Combobox
        ref={ref}
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        autoComplete="off"
        onInputChange={(e: any) => {
          debouncedFetchBrands(e.target.value);
        }}
        label={label || 'Search brands'}
        placeholder="Search brands"
        loading={loading}
      >
        {brands.map((brand: any) => (
          <ComboboxOption
            onMouseDown={() => {
              console.log('brand', brand);
              handleChange({ id: brand.id, name: brand.displayName });
            }}
            key={brand.id}
            value={{ id: brand.id, name: brand.displayName }}
          >
            {brand.displayName.replace(/-/g, ' ').replace(/\b\w/g, (l: any) => l.toUpperCase())}
          </ComboboxOption>
        ))}
      </Combobox>
    </div>
  );
});

export default Input;
