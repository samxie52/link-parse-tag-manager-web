# Link Parse Result Components

A comprehensive set of React components for displaying and editing link parsing results with platform-specific styling and functionality.

## Overview

The link parsing result system consists of several components that work together to display parsed link data in an organized, editable interface:

- **LinkParseResultDialog**: Main dialog component with tabbed interface
- **BasicSection**: Displays core parsed data (title, description, tags, media)
- **PlatformSection**: Shows platform-specific metadata with themed styling
- **AISection**: Displays AI-enhanced parsing results
- Supporting components: EditableField, TagManager, ImagePreview

## Features

- ✅ **Editable Mode**: Toggle between read-only and edit modes
- ✅ **Platform Support**: XiaoHongShu (red theme) and AMAP (blue theme)
- ✅ **Media Preview**: Image thumbnails with modal viewer
- ✅ **Tag Management**: Add/remove tags in edit mode
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **TypeScript**: Full type safety
- ✅ **Internationalization**: Ready for i18n integration

## Quick Start

```tsx
import { LinkParseResultDialog } from '@/components/link-parser';
import { parseUrl } from '@/lib/link-parser';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [parseResult, setParseResult] = useState(null);

  const handleParseLink = async (url: string) => {
    try {
      const result = await parseUrl(url);
      setParseResult(result);
      setIsOpen(true);
    } catch (error) {
      console.error('Parse failed:', error);
    }
  };

  const handleSave = async (updatedData) => {
    // Save logic here
    console.log('Saving:', updatedData);
  };

  return (
    <LinkParseResultDialog
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      data={parseResult}
      editable={true}
      onSave={handleSave}
    />
  );
}
```

## Component API

### LinkParseResultDialog

Main dialog component that orchestrates all sections.

```tsx
interface LinkParseResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: ParseResponse | null;
  editable?: boolean;
  onSave?: (data: ParseResponse) => Promise<void>;
}
```

### BasicSection

Displays core parsed information.

```tsx
interface BasicSectionProps {
  data: BasicInfo;
  editable: boolean;
  onChange: (data: BasicInfo) => void;
}
```

### PlatformSection

Renders platform-specific metadata with appropriate theming.

```tsx
interface PlatformSectionProps {
  platform: string;
  data: any;
  editable: boolean;
  onChange: (data: any) => void;
}
```

## Supported Platforms

### XiaoHongShu (小红书)
- **Theme**: Red accent colors
- **Data**: Note info, author details, interaction stats, media counts
- **Features**: Editable note title, author info, tag management

### AMAP (高德地图)
- **Theme**: Blue accent colors  
- **Data**: POI details, address, coordinates, contact info, ratings
- **Features**: Editable POI name, address, contact details

### Generic Platform
- **Theme**: Default gray theme
- **Data**: Key-value pairs display
- **Features**: Basic editing for string values

## Styling

Components use CSS custom properties for theming:

```css
/* Platform-specific themes */
.xiaohongshu-theme {
  --accent-color: rgb(239, 68, 68); /* red-500 */
  --accent-light: rgb(254, 226, 226); /* red-100 */
}

.amap-theme {
  --accent-color: rgb(59, 130, 246); /* blue-500 */
  --accent-light: rgb(219, 234, 254); /* blue-100 */
}

.ai-theme {
  --accent-color: rgb(147, 51, 234); /* purple-600 */
  --accent-light: rgb(243, 232, 255); /* purple-100 */
}
```

## Data Flow

1. **Parse Request**: Use `parseUrl()` from `@/lib/link-parser`
2. **Display**: Pass result to `LinkParseResultDialog`
3. **Edit**: Toggle editable mode, modify data in sections
4. **Save**: Handle save callback with updated data
5. **Persist**: Save changes via your API

## Error Handling

Components include built-in error boundaries and fallback UI:

```tsx
// Fallback for unknown platforms
if (!platformComponent) {
  return <GenericMetadataDisplay data={data} />;
}

// Error boundary for media loading
<ImagePreview 
  images={images}
  onError={(error) => console.warn('Image load failed:', error)}
/>
```

## Performance Considerations

- **Lazy Loading**: Images load on demand
- **Memoization**: Components use React.memo for optimization
- **Debounced Editing**: Input changes are debounced to prevent excessive updates

## Customization

### Adding New Platforms

1. Create platform metadata component in `platforms/` directory
2. Add platform detection logic to `PlatformSection`
3. Define TypeScript types in `types.ts`
4. Add platform-specific styling

```tsx
// Example: TikTok platform component
export function TikTokMetadata({ data, editable, onChange }: PlatformMetadataProps) {
  return (
    <div className="tiktok-theme">
      {/* Platform-specific UI */}
    </div>
  );
}
```

### Custom Themes

Override CSS custom properties for custom styling:

```css
.custom-theme {
  --accent-color: #your-color;
  --accent-light: #your-light-color;
}
```

## Testing

Components are designed to be testable with clear props and predictable behavior:

```tsx
import { render, screen } from '@testing-library/react';
import { LinkParseResultDialog } from '@/components/link-parser';

test('displays basic information', () => {
  const mockData = {
    parse_type: 'basic',
    platform: 'xiaohongshu',
    basic: { title: 'Test Title' }
  };
  
  render(
    <LinkParseResultDialog 
      isOpen={true} 
      onClose={() => {}} 
      data={mockData} 
    />
  );
  
  expect(screen.getByText('Test Title')).toBeInTheDocument();
});
```

## Troubleshooting

### Common Issues

1. **Images not loading**: Check CORS settings and image URLs
2. **Platform not recognized**: Verify platform string matches supported platforms
3. **Editing not working**: Ensure `editable` prop is true and `onChange` handlers are provided
4. **Styling issues**: Check that CSS custom properties are properly defined

### Debug Mode

Enable debug logging by setting environment variable:

```bash
NEXT_PUBLIC_DEBUG_LINK_PARSER=true
```

## Contributing

When adding new features:

1. Follow existing TypeScript patterns
2. Add proper error handling
3. Include accessibility attributes
4. Update this documentation
5. Add tests for new functionality

## License

Part of the link-parse-tag-manager project.
