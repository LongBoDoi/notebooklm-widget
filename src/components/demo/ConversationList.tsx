import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "../../lib/axios"
import { Button, Input, ScrollArea, Table } from "@mantine/core"
import useConversationsStore from "../../stores/conversations.store"
import { useInputState } from "@mantine/hooks"
import { WidgetService } from "../../services/widget-demo.service"

export default function ConversationList() {
    const { selectedConversation, setSelectedConversation, setSelectedConversationId } = useConversationsStore()
    const [newConversationTitle, setNewConversationTitle] = useInputState('')

    const conversationsQuery = useQuery({
        queryKey: ['conversations'],
        queryFn: async () => {
            const response = await api.get(`https://api.vts-dasc.net/deployment-conversations`, {
                params: {
                    offset: 0,
                    limit: 100
                }
            })
            console.log('Conversations response', response.data)
            return response.data.results
        },
    })

    const createConversationMutation = useMutation({
        mutationFn: async () => {
            const data = await WidgetService.createConversation('https://api.vts-dasc.net', newConversationTitle)

            return data
        },
        onSuccess: (data) => {
            setSelectedConversation(data)
            setSelectedConversationId(data.id)

            conversationsQuery.refetch()

            setNewConversationTitle('')
        },
    })

    return <div>
        <h1 className="text-2xl font-bold">Danh sách hội thoại</h1>

        <div className="max-h-[500px] mt-4">
        <ScrollArea.Autosize mah={500}>

        <Table stickyHeader highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>ID</Table.Th>
                    <Table.Th>Tiêu đề</Table.Th>
                    <Table.Th>Thời gian tạo</Table.Th>
                </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
                {conversationsQuery.data?.map((conversation: any) => (
                    <Table.Tr key={conversation.id} onClick={() => {
                        setSelectedConversation(conversation)
                        setSelectedConversationId(conversation.id)
                    }} bg={selectedConversation?.id === conversation.id ? 'skyblue' : undefined} style={{ cursor: 'pointer' }}>
                        <Table.Td>{conversation.id}</Table.Td>
                        <Table.Td>{conversation.title}</Table.Td>
                        <Table.Td>{new Date(conversation.createdAt).toLocaleString()}</Table.Td>
                    </Table.Tr>
                ))}
            </Table.Tbody>
        </Table>
        </ScrollArea.Autosize>
        </div>

        <h1 className="my-4 text-2xl font-bold">Tạo hội thoại mới</h1>

        <Input value={newConversationTitle} onChange={setNewConversationTitle} placeholder="Nhập tiêu đề hội thoại mới" className="w-fit min-w-[300px]" />
        <Button className="mt-2 w-auto" onClick={() => createConversationMutation.mutate()}>Tạo</Button>
    </div>
}