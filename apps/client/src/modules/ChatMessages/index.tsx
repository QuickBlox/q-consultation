import SectionList from '../../components/SectionList'
import MessageGroup from './MessageGroup'
import useComponent, { ChatMessagesProps } from './useComponent'
import './styles.css'
import MessageBody from './MessageBody'

export default function ChatMessages(props: ChatMessagesProps) {
  const {
    data: { sections, resetScroll },
    store: { myAccountId, loading, users, translate },
    actions: { markMessageRead, getTranslate, showNotification },
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
      renderItem={([key, groupMessages], sectionListRef) => (
        <MessageGroup
          key={key}
          users={users}
          messages={groupMessages}
          myAccountId={myAccountId}
          markMessageRead={markMessageRead}
          chatOpen={props.chatOpen}
          renderMessage={(message, isMine) => (
            <MessageBody
              key={message._id}
              message={message}
              isMine={isMine}
              messagesContainerRef={sectionListRef}
              language={translate[message._id]?.language}
              translatedMessage={translate[message._id]?.translatedMessage}
              loading={translate[message._id]?.loading}
              getTranslate={getTranslate}
              showNotification={showNotification}
            />
          )}
        />
      )}
      sections={sections}
    />
  )
}
