// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents'
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
import Image from '../components/Image'

export default {
  // Re-use the default mapping
  ...MDXComponents,

  /**
   * Components below are imported within the global scope,
   * meaning you don't have to insert the typical 'import SomeStuff from '/path/to/stuff' line
   * at the top of a Markdown file before being able to use these components
   *  — see https://docusaurus.io/docs/next/markdown-features/react#mdx-component-scope
   */
  Tabs,
  TabItem,
  Image,
}
