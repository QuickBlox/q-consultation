import SectionList from '../../components/SectionList'
import MessageGroup from './MessageGroup'
import useComponent, { ChatMessagesProps } from './useComponent'
import './styles.css'

export default function ChatMessages(props: ChatMessagesProps) {
  const { chatOpen, setInputValue } = props
  const {
    data: { sections, resetScroll },
    store: { myAccountId, loading, users },
    actions: { markMessageRead, getQuickAnswer },
    handlers: { loadMoreMessages },
  } = useComponent(props)

  return (
    <SectionList
      resetScroll={resetScroll}
      className="messages-container"
      onEndReached={loadMoreMessages}
      onEndReachedThreshold={0.95}
      refreshing={loading}
      renderSectionHeader={(section) => (
        <div className="date">{section.title}</div>
      )}
      renderItem={([key, groupMessages]) => (
        <MessageGroup
          key={key}
          users={users}
          messages={groupMessages}
          myAccountId={myAccountId}
          chatOpen={chatOpen}
          markMessageRead={markMessageRead}
          getQuickAnswer={getQuickAnswer}
          setInputValue={setInputValue}
        />
      )}
      sections={sections}
    />
  )
}
