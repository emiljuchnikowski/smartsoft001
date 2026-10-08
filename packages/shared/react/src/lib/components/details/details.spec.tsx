import { render, renderHook, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartDetails } from './details';
import { SmartDetailsProps } from './details.types';
import { SmartDetailsStandard } from './standard/details-standard';
import { useDetails } from './use-details';
import { IDetailsOptions } from '../../models';
import { useDetailsService } from '../../providers/hooks';
import { SmartProvider } from '../../providers/smart-provider';
import { AuthService } from '../../services/auth/auth.service';

@Model({})
class Customer implements IEntity<string> {
  id = 'customer-1';

  @Field({ details: true })
  name = 'Ada';

  @Field({ details: true })
  email = 'ada@example.com';

  @Field({ list: true })
  internal = 'internal';
}

@Model({})
class Contract implements IEntity<string> {
  id = 'contract-1';

  @Field({ details: true })
  status = 'active';

  @Field({ details: { permissions: ['admin'] } })
  margin = '12%';

  @Field({ details: { enabled: { criteria: { status: 'active' } } } })
  discount = '10%';

  @Field({ details: true, enabled: { criteria: { status: 'active' } } })
  bonus = '5%';
}

@Model({})
class Contact implements IEntity<string> {
  id = 'contact-1';

  @Field({ details: true })
  label = 'Main';

  @Field({ details: { enabled: { criteria: { '$root.status': 'vip' } } } })
  phone = '500600700';
}

@Model({})
class Client implements IEntity<string> {
  id = 'client-1';

  @Field({ details: true })
  status = 'vip';

  @Field({ type: FieldType.object, classType: Contact, details: true })
  contact = new Contact();
}

function customerOptions(
  partial: Partial<IDetailsOptions<Customer>> = {},
): IDetailsOptions<Customer> {
  return { type: Customer, item: new Customer(), ...partial };
}

function contract(status: string): Contract {
  return Object.assign(new Contract(), { status });
}

function authWith(permissions: string[]): AuthService {
  return {
    expectPermissions: (expected: string[] | null) =>
      !!expected?.some((p) => permissions.includes(p)),
  } as unknown as AuthService;
}

function wrapperWith(props: Parameters<typeof SmartProvider>[0] = {}) {
  return ({ children }: { children: ReactNode }) => (
    <SmartProvider {...props}>{children}</SmartProvider>
  );
}

describe('@smartsoft001/react: SmartDetails', () => {
  it('should render the standard implementation by default', () => {
    const { container } = render(<SmartDetails options={customerOptions()} />);

    expect(container.querySelector('dl')).toHaveClass('smart:divide-y');
  });

  it('should render the implementation registered as components.details', () => {
    const Custom = ({ options, className }: SmartDetailsProps<Customer>) => (
      <div data-testid="custom" className={className}>
        {options?.item?.name}
      </div>
    );

    render(
      <SmartProvider components={{ details: Custom }}>
        <SmartDetails options={customerOptions()} className="my-class" />
      </SmartProvider>,
    );
    const custom = screen.getByTestId('custom');

    expect([custom.textContent, custom.className]).toEqual(['Ada', 'my-class']);
  });
});

describe('@smartsoft001/react: SmartDetailsStandard', () => {
  it('should render a <dl> with the divider classes', () => {
    const { container } = render(
      <SmartDetailsStandard options={customerOptions()} />,
    );

    expect(container.querySelector('dl')).toHaveClass(
      'smart:divide-y',
      'smart:divide-gray-100',
      'smart:dark:divide-white/10',
    );
  });

  it('should apply the border classes to the container', () => {
    const { container } = render(
      <SmartDetailsStandard options={customerOptions()} />,
    );

    expect(container.firstElementChild).toHaveClass(
      'smart:border-t',
      'smart:border-gray-100',
      'smart:dark:border-white/10',
    );
  });

  it('should append className to the container', () => {
    const { container } = render(
      <SmartDetailsStandard
        options={customerOptions()}
        className="my-extra-class"
      />,
    );

    expect(container.firstElementChild).toHaveClass(
      'my-extra-class',
      'smart:border-t',
    );
  });

  it('should render a row per field marked for details', () => {
    const { container } = render(
      <SmartDetailsStandard options={customerOptions()} />,
    );

    expect(container.querySelectorAll('dl > div')).toHaveLength(2);
  });

  it('should render the label and the value of every field', () => {
    render(
      <SmartProvider
        translations={{ MODEL: { name: 'Name', email: 'E-mail' } }}
      >
        <SmartDetailsStandard options={customerOptions()} />
      </SmartProvider>,
    );

    expect([
      screen.getByText('Name').tagName,
      screen.getByText('Ada').tagName,
      screen.getByText('E-mail').tagName,
      screen.getByText('ada@example.com').tagName,
    ]).toEqual(['SPAN', 'P', 'SPAN', 'P']);
  });

  it('should render a skeleton per field while there is no item', () => {
    const { container } = render(
      <SmartDetailsStandard options={customerOptions({ item: undefined })} />,
    );

    expect(container.querySelectorAll('.smart\\:animate-pulse')).toHaveLength(
      2,
    );
  });

  it('should render the values through the cell pipe', () => {
    const cellPipe = {
      transform: (item: Customer, key: string) =>
        `${key}: ${(item as unknown as Record<string, string>)[key]}`,
    };

    render(<SmartDetailsStandard options={customerOptions({ cellPipe })} />);

    expect(screen.getByText('name: Ada')).toBeInTheDocument();
  });

  it('should render the top and bottom component factories around the fields', () => {
    const Top = () => <p data-testid="top">Top</p>;
    const Bottom = () => <p data-testid="bottom">Bottom</p>;

    const { container } = render(
      <SmartDetailsStandard
        options={customerOptions({
          componentFactories: { top: Top, bottom: Bottom },
        })}
      />,
    );
    const children = Array.from(container.firstElementChild?.children ?? []);

    expect(
      children.map((child) =>
        child.tagName === 'DL'
          ? 'dl'
          : child.querySelector('[data-testid]')?.getAttribute('data-testid'),
      ),
    ).toEqual(['top', 'dl', 'bottom']);
  });

  it('should render nothing in the dl without options', () => {
    const { container } = render(<SmartDetailsStandard options={undefined} />);

    expect(container.querySelector('dl')).toBeEmptyDOMElement();
  });
});

describe('@smartsoft001/react: useDetails', () => {
  it('should list the fields marked for details', () => {
    const { result } = renderHook(() =>
      useDetails({ options: customerOptions() }),
    );

    expect(result.current.fields?.map((f) => f.key)).toEqual(['name', 'email']);
  });

  it('should convert a plain object to the model type', () => {
    const { result } = renderHook(() =>
      useDetails({
        options: {
          type: Customer,
          item: { id: 'plain-id', name: 'Plain name' } as Customer,
        },
      }),
    );

    expect([
      result.current.item instanceof Customer,
      result.current.item?.name,
    ]).toEqual([true, 'Plain name']);
  });

  it('should keep an item of the model type', () => {
    const item = new Customer();

    const { result } = renderHook(() =>
      useDetails({ options: customerOptions({ item }) }),
    );

    expect(result.current.item).toBe(item);
  });

  it('should expose the loading flag, the cell pipe and the component factories', () => {
    const cellPipe = { transform: () => 'x' };
    const componentFactories = { top: () => null };

    const { result } = renderHook(() =>
      useDetails({
        options: customerOptions({
          loading: true,
          cellPipe,
          componentFactories,
        }),
      }),
    );

    expect([
      result.current.loading,
      result.current.cellPipe,
      result.current.componentFactories,
    ]).toEqual([true, cellPipe, componentFactories]);
  });

  it('should hide a field the user has no permission for', () => {
    const { result } = renderHook(
      () =>
        useDetails({ options: { type: Contract, item: contract('active') } }),
      { wrapper: wrapperWith({ authService: authWith([]) }) },
    );

    expect(result.current.fields?.map((f) => f.key)).not.toContain('margin');
  });

  it('should show a field the user has the permission for', () => {
    const { result } = renderHook(
      () =>
        useDetails({ options: { type: Contract, item: contract('active') } }),
      { wrapper: wrapperWith({ authService: authWith(['admin']) }) },
    );

    expect(result.current.fields?.map((f) => f.key)).toContain('margin');
  });

  it('should show the fields whose enabled specification the item meets', () => {
    const { result } = renderHook(
      () =>
        useDetails({ options: { type: Contract, item: contract('active') } }),
      { wrapper: wrapperWith({ authService: authWith([]) }) },
    );

    expect(result.current.fields?.map((f) => f.key)).toEqual([
      'status',
      'discount',
      'bonus',
    ]);
  });

  it('should hide the fields whose enabled specification the item fails', () => {
    const { result } = renderHook(
      () =>
        useDetails({ options: { type: Contract, item: contract('closed') } }),
      { wrapper: wrapperWith({ authService: authWith([]) }) },
    );

    expect(result.current.fields?.map((f) => f.key)).toEqual(['status']);
  });

  it('should keep the fields with a specification while there is no item', () => {
    const { result } = renderHook(
      () => useDetails({ options: { type: Contract, item: undefined } }),
      { wrapper: wrapperWith({ authService: authWith([]) }) },
    );

    expect(result.current.fields?.map((f) => f.key)).toEqual([
      'status',
      'discount',
      'bonus',
    ]);
  });

  it('should make the item the details root', () => {
    const item = new Customer();

    const { result } = renderHook(
      () => ({
        details: useDetails({ options: customerOptions({ item }) }),
        root: useDetailsService().$root,
      }),
      { wrapper: wrapperWith() },
    );

    expect(result.current.root).toBe(item);
  });

  it('should evaluate a nested $root specification against the outer item', () => {
    const client = new Client();

    render(
      <SmartProvider>
        <SmartDetails options={{ type: Client, item: client }} />
      </SmartProvider>,
    );

    expect(screen.getByText('500600700')).toBeInTheDocument();
  });

  it('should hide a nested field whose $root specification fails', () => {
    const client = Object.assign(new Client(), { status: 'regular' });

    render(
      <SmartProvider>
        <SmartDetails options={{ type: Client, item: client }} />
      </SmartProvider>,
    );

    expect([
      screen.queryByText('500600700'),
      screen.getByText('Main').tagName,
    ]).toEqual([null, 'P']);
  });

  it('should list no fields without a model type', () => {
    const { result } = renderHook(() => useDetails({ options: undefined }));

    expect(result.current.fields).toBeNull();
  });
});
