import {
  createMutation,
  createQuery,
  keepPreviousData,
  useQuery,
} from "@almach/query";
import {
  Badge,
  Button,
  Card,
  Separator,
  Skeleton,
  Tabs,
  useToast,
} from "@almach/ui";
import { Plus, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { getPackageVersion } from "../../lib/package-versions";
import { CodeBlock } from "../code-block";

interface Post {
  id: number;
  title: string;
  userId: number;
}

let mockPosts: Post[] = [
  { id: 1, title: "Hello Almach", userId: 1 },
  { id: 2, title: "TanStack Query rocks", userId: 1 },
  { id: 3, title: "Zod is great", userId: 2 },
];
let nextId = 4;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const postsQuery = createQuery({
  queryKey: () => ["posts"],
  queryFn: async () => {
    await delay(500);
    return [...mockPosts];
  },
  staleTime: 0,
});

const postQuery = createQuery({
  queryKey: (id: number) => ["posts", id],
  queryFn: async (id: number) => {
    await delay(300);
    const post = mockPosts.find((p) => p.id === id);
    if (!post) throw new Error("Post not found");
    return post;
  },
});

const useCreatePost = createMutation({
  mutationFn: async (title: string) => {
    await delay(700);
    const post: Post = { id: nextId++, title, userId: 1 };
    mockPosts = [...mockPosts, post];
    return post;
  },
  invalidates: [["posts"]],
});

const useDeletePost = createMutation({
  mutationFn: async (id: number) => {
    await delay(400);
    mockPosts = mockPosts.filter((p) => p.id !== id);
    return { id };
  },
  invalidates: [["posts"]],
});

function PostList() {
  const { toast: showToast } = useToast();
  const {
    data: posts,
    isLoading,
    isFetching,
    refetch,
  } = useQuery(postsQuery.options());
  const createPost = useCreatePost();
  const deletePost = useDeletePost();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {posts?.length ?? 0} posts{isFetching && " · refreshing…"}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
            loading={isFetching}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
          <Button
            size="sm"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            loading={createPost.isPending}
            onClick={() =>
              createPost.mutate(`New post #${nextId}`, {
                onSuccess: (post) =>
                  showToast({
                    title: `Created "${post.title}"`,
                    variant: "success",
                  }),
              })
            }
          >
            Add
          </Button>
        </div>
      </div>

      <div className="space-y-1.5">
        {posts?.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">{post.title}</span>
              <Badge variant="secondary" className="text-[11px]">
                user {post.userId}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-destructive"
              aria-label={`Delete "${post.title}"`}
              loading={deletePost.isPending && deletePost.variables === post.id}
              onClick={() =>
                deletePost.mutate(post.id, {
                  onSuccess: () =>
                    showToast({ title: `Deleted "${post.title}"` }),
                })
              }
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SinglePost() {
  const [id, setId] = useState(1);
  const { data, isLoading, error } = useQuery({
    ...postQuery.options(id),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Post ID:</span>
        {[1, 2, 3, 99].map((n) => (
          <Button
            key={n}
            size="sm"
            variant={id === n ? "default" : "outline"}
            onClick={() => setId(n)}
          >
            {n}
          </Button>
        ))}
      </div>

      {isLoading && <Skeleton className="h-16 w-full rounded-lg" />}
      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      )}
      {data && (
        <div className="rounded-lg border px-4 py-3 text-sm space-y-2">
          {[
            { label: "id", value: data.id },
            { label: "title", value: data.title },
            { label: "userId", value: data.userId },
          ].map(({ label, value }) => (
            <div key={label} className="flex gap-3">
              <span className="w-14 text-muted-foreground shrink-0 font-mono text-xs">
                {label}
              </span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const installCode = `npm install @almach/query`;

const queryCode = `import { createQuery, useQuery } from "@almach/query";

// Define query once — reuse anywhere
const usersQuery = createQuery({
  queryKey: () => ["users"],
  queryFn: () => fetch("/api/users").then((r) => r.json()),
  staleTime: 5 * 60 * 1000,
});

// Use it in components — fully typed
function UserList() {
  const { data, isLoading, error } = useQuery(usersQuery.options());

  if (isLoading) return <Skeleton />;
  if (error) return <Error />;

  return data?.map((user) => <UserRow key={user.id} user={user} />);
}`;

const mutationCode = `import { createMutation } from "@almach/query";

const useDeleteUser = createMutation({
  mutationFn: (id: string) =>
    fetch(\`/api/users/\${id}\`, { method: "DELETE" }),

  // Automatically invalidates the users list on success
  invalidates: [["users"]],
});

function UserRow({ user }) {
  const deleteUser = useDeleteUser();

  return (
    <Button
      loading={deleteUser.isPending}
      onClick={() => deleteUser.mutate(user.id)}
    >
      Delete
    </Button>
  );
}`;

const serverActionCode = `import { createServerAction } from "@almach/query";

// Wraps Next.js server actions with proper error handling
const useCreateUser = createServerAction({
  action: createUserAction, // your server action
  invalidates: [["users"]],
  onSuccess: () => router.push("/users"),
});`;

export function QueryPage() {
  return (
    <div className="px-4 py-8 md:px-5 md:py-9">
      <div className="mb-8 border-b pb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-mono">
            @almach/query
          </Badge>
          <Badge variant="ghost" className="font-mono text-[11px]">
            v{getPackageVersion("@almach/query")}
          </Badge>
        </div>
        <h1 className="mb-2 text-3xl font-semibold tracking-tight md:text-[2.1rem]">
          Data Fetching
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed md:text-base">
          Typed query factories and mutation builders on top of TanStack Query,
          with consistent cache invalidation.
        </p>
      </div>

      {/* Interactive demos */}
      <div
        id="query-demos"
        className="mb-10 grid scroll-mt-20 gap-4 md:grid-cols-2"
      >
        <Card>
          <Card.Header>
            <Card.Title className="text-base">List + mutations</Card.Title>
            <p className="text-sm text-muted-foreground mt-0.5">
              Add and delete posts — mutations auto-invalidate the list.
            </p>
          </Card.Header>
          <Card.Content>
            <PostList />
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title className="text-base">Single resource</Card.Title>
            <p className="text-sm text-muted-foreground mt-0.5">
              Switch IDs — uses{" "}
              <code className="font-mono text-xs">keepPreviousData</code>. ID 99
              shows an error state.
            </p>
          </Card.Header>
          <Card.Content>
            <SinglePost />
          </Card.Content>
        </Card>
      </div>

      <Separator className="mb-8" />

      {/* Documentation */}
      <div className="space-y-8">
        <div id="query-install" className="scroll-mt-20">
          <h2 className="mb-1 text-lg font-semibold">Installation</h2>
          <CodeBlock filename="Terminal" code={installCode} />
        </div>

        <div id="query-queries" className="scroll-mt-20">
          <h2 className="mb-1 text-lg font-semibold">Queries</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Use <code className="font-mono text-xs">createQuery</code> to define
            a typed query factory. Call{" "}
            <code className="font-mono text-xs">.options()</code> to get{" "}
            <code className="font-mono text-xs">queryOptions</code> compatible
            with TanStack Query.
          </p>
          <Tabs defaultValue="code">
            <Tabs.List>
              <Tabs.Trigger value="code">Code</Tabs.Trigger>
              <Tabs.Trigger value="api">API</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="code">
              <CodeBlock code={queryCode} className="mt-2" />
            </Tabs.Content>
            <Tabs.Content value="api">
              <div className="mt-2 rounded-xl border p-5">
                <div className="grid gap-4 sm:grid-cols-2 text-sm">
                  {[
                    {
                      prop: "queryKey",
                      type: "(...args) => QueryKey",
                      desc: "Factory for the cache key.",
                    },
                    {
                      prop: "queryFn",
                      type: "(...args) => Promise<T>",
                      desc: "Fetches the data.",
                    },
                    {
                      prop: "staleTime",
                      type: "number (ms)",
                      desc: "How long data is fresh.",
                    },
                    {
                      prop: ".options(...args)",
                      type: "queryOptions",
                      desc: "Returns TanStack-compatible options.",
                    },
                  ].map(({ prop, type, desc }) => (
                    <div key={prop} className="space-y-0.5">
                      <p className="font-mono text-xs font-medium text-foreground">
                        {prop}
                      </p>
                      <p className="font-mono text-[11px] text-muted-foreground/70">
                        {type}
                      </p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Tabs.Content>
          </Tabs>
        </div>

        <div id="query-mutations" className="scroll-mt-20">
          <h2 className="mb-1 text-lg font-semibold">Mutations</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Use <code className="font-mono text-xs">createMutation</code> to
            define a typed mutation hook with automatic cache invalidation.
          </p>
          <Tabs defaultValue="code">
            <Tabs.List>
              <Tabs.Trigger value="code">Code</Tabs.Trigger>
              <Tabs.Trigger value="api">API</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="code">
              <CodeBlock code={mutationCode} className="mt-2" />
            </Tabs.Content>
            <Tabs.Content value="api">
              <div className="mt-2 rounded-xl border p-5">
                <div className="grid gap-4 sm:grid-cols-2 text-sm">
                  {[
                    {
                      prop: "mutationFn",
                      type: "(input) => Promise<T>",
                      desc: "Performs the mutation.",
                    },
                    {
                      prop: "invalidates",
                      type: "QueryKey[]",
                      desc: "Query keys to refetch on success.",
                    },
                    {
                      prop: "onSuccess",
                      type: "(data) => void",
                      desc: "Called after success.",
                    },
                    {
                      prop: "onError",
                      type: "(error) => void",
                      desc: "Called after error.",
                    },
                  ].map(({ prop, type, desc }) => (
                    <div key={prop} className="space-y-0.5">
                      <p className="font-mono text-xs font-medium text-foreground">
                        {prop}
                      </p>
                      <p className="font-mono text-[11px] text-muted-foreground/70">
                        {type}
                      </p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Tabs.Content>
          </Tabs>
        </div>

        <div id="query-server-actions" className="scroll-mt-20">
          <h2 className="mb-1 text-lg font-semibold">Server Actions</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Wrap Next.js server actions with{" "}
            <code className="font-mono text-xs">createServerAction</code> for
            type-safe error handling and automatic cache invalidation.
          </p>
          <CodeBlock code={serverActionCode} />
        </div>
      </div>
    </div>
  );
}
