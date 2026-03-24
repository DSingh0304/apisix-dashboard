# SchemaForm

A dynamic form generator that renders Mantine UI components from a JSON Schema definition.
It is used by `PluginEditorDrawer` to provide a structured GUI for APISIX plugin configuration.

## Architecture

SchemaForm
├── index.tsx          # Root renderer. Dispatches to sub-renderers per schema keyword.
├── SchemaField.tsx    # Maps a single property to the correct Mantine widget.
├── ArrayField.tsx     # Handles array-of-objects using RHF's useFieldArray.
├── validation.ts      # AJV-based validator. Provides createSchemaResolver for useForm().
└── types.ts           # JSONSchema7 TypeScript interface (includes APISIX extensions).

## Supported JSON Schema Keywords

| Keyword                | Rendered As                    |
|------------------------|-------------------------------|
| type: string           | TextInput                     |
| type: boolean          | Switch                        |
| type: number/integer   | NumberInput (respects min/max)|
| type: array (string)   | TagsInput                     |
| type: array (object)   | ArrayField (useFieldArray)    |
| type: object           | Nested Fieldset               |
| enum                   | Select dropdown               |
| oneOf                  | Discriminator-based Variant Selector |
| anyOf                  | Discriminator-based Variant Selector |
| dependencies           | Conditional Sub-Form          |
| if / then / else       | AJV-evaluated Conditional     |
| patternProperties      | Dynamic Key-Value Editor      |
| encrypt_fields (APISIX extension) | PasswordInput      |

## Known Limitations (Planned in Phase 3)

- `$ref` / `$defs` — Not yet resolved. Circular references not supported.
- `allOf` — Not yet merged/rendered.

## Running Tests

pnpm test -- SchemaForm
