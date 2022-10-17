import {
  PageSize,
  TDocumentDefinitions,
  TFontDictionary,
} from 'pdfmake/interfaces'
import pdfMake from 'pdfmake/build/pdfmake'

import { localeFonts } from '../constants/locale'

interface PdfParams {
  lang?: string
  pageSize?: PageSize
  title: string
  author?: string
  content?: string
}

export const createPdf = (params: PdfParams) => {
  const fonts: TFontDictionary = {
    Font: {
      normal: localeFonts[params.lang || DEFAULT_LANGUAGE],
    },
  }

  const documentDefinitions: TDocumentDefinitions = {
    pageSize: params.pageSize || 'A4',
    defaultStyle: {
      font: 'Font',
    },
    info: {
      title: params.title,
      author: params.author,
    },
    content: params.content || '',
  }

  return pdfMake.createPdf(documentDefinitions, undefined, fonts)
}
