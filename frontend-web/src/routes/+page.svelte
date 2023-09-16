<script lang="ts">
	import { api } from '$lib/trpc';
	import { TRPCClientError } from '@trpc/client';
	import { onMount } from 'svelte';

	let result: string;
	let users: {
		id: string;
		email: string;
	}[] = [];
	let newUserEmail = '';

	onMount(async () => {
		users = await api.getAllUsers.query();
	});

	let userId: string | undefined = undefined;
	let userEmail = '';
</script>

<div class="flex flex-col container mx-auto mt-10 gap-3">
	<div class="m-24">
		<input
			class="input input-bordered"
			type="email"
			placeholder="user email"
			bind:value={newUserEmail}
		/>
		<button
			class="btn"
			on:click={async () => {
				try {
					const createdUser = await api.createUser.mutate({
						email: newUserEmail
					});
					if (createdUser) {
						users.push(createdUser);
						users = users;
					} else {
						console.log('created user was null!');
					}
				} catch (e) {
					if (e instanceof TRPCClientError) {
						console.dir(e);
					} else {
						console.log(e);
					}
				}
				newUserEmail = '';
			}}>create user</button
		>
	</div>
	<div>
		<h2>Users:</h2>
		{#each users as user}
			<div class="p-4 border border-indigo-600 flex flex-col gap-2">
				<div>{user.id}</div>
				<div>{user.email}</div>
			</div>
		{/each}
	</div>

	<div>result: {result}</div>
	<div>UserEmail: {userEmail}</div>
	<input class="input input-bordered" type="text" placeholder="User id" bind:value={userId} />
	<button
		class="btn btn-primary"
		on:click={async () => {
			if (!userId) return;
			const { email } = await api.getUsers.query({
				id: userId
			});
			userEmail = email;
		}}>Query</button
	>
</div>
