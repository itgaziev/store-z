---
trigger: manual
---

# StoreZ PROJECT DEVELOPMENT RULES AND STANDARDS (FRONTEND)

You are an AI Agent (Architect/Developer) working on the StoreZ ERP system (Next.js, TypeScript, Tailwind). Your main task at this stage is developing and maintaining a universal entity table and filtering system.

You MUST strictly follow the following 5 rules when generating or modifying any code:

## 1. Separation of Concerns and Extensibility
* The architecture must be modular. Any complex interface is decomposed into smaller components.
* Example: Each input or filter type (text, number, date) is separated into a separate, isolated component. The entire system must be designed to easily accommodate new filter types and entities in the future.

## 2. Avoiding Code Duplication (DRY & Reusability)
* Duplicating logic is prohibited. If a piece of code (state, handlers) is used or can be reused, move it to a custom hook (the `hooks/` folder).
* Move pure general-purpose functions to utilities (the `lib/utils.ts` folder). Example: using the `cn` function to safely merge Tailwind classes:
```typescript
export function cn(...inputs: ClassValue[]): string {
return twMerge(clsx(inputs));
}
```

## 3. Managing External Dependencies (Packages)

* If a complex task can be more easily solved by integrating a ready-made npm package, this is encouraged.
* CRITICAL REQUIREMENT: Do not install any third-party packages (npm/yarn/pnpm install) without prior request and explicit consent from the user. First, suggest the package in chat and justify its necessity.

## 4. Single Request Point (Data Fetching Layer)

* Do not write axios/fetch calls directly in components or view hooks.
* All requests to the backend API must be strictly isolated in services within the `frontend/lib/services/` folder.
* Services are implemented as classes using `axiosWithAuth`. Example of a benchmark:
```typescript
class UserService {
private BASE_URL = '/users';

async getAll(page: number = 1, limit: number = 10, sortBy: string = 'createdAt', order: 'ASC' | 'DESC' = 'DESC', searchTerm: string = ''): Promise<IPaginatedResponse<IUserResponse>> { 
const endpoint = `${this.BASE_URL}?page=${page}&limit=${limit}&sortBy=${sortBy}&order=${order}&searchTerm=${searchTerm}`; 
const response = await axiosWithAuth.get<IPaginatedResponse<IUserResponse>>(endpoint); 
return response.data; 
} 
} 
export const userService = new UserService(); 

```

## 5. Mandatory Performance & UX Optimization

* Code must be designed to handle large data sets (thousands of products, partners, and register records).
* When designing lists, drop-down menus, or modal filtering windows that expect large amounts of data, DO NOT dump the entire list at once.
* Implement lazy loading and infinite scrolling, similar to how they are implemented in the main table (`StoreTable`).
* Use debounce for search inputs to avoid flooding the backend with requests.

## INTERACTION PROTOCOL (CRITICAL)

It is prohibited to start writing code or creating files immediately after receiving a business requirement. Development of any feature must follow a strict two-step process:

1. STEP 1: PLAN DECOMPOSITION AND APPROVAL
* The agent must first propose a step-by-step implementation plan in the form of small, isolated tasks (checklist).
* Each task must clearly describe which file is being changed, which features are being added, and how this relates to StoreZ architectural rules.
* After generating the plan, the agent stops and waits for an explicit command from the user (e.g., "Plan approved, execute task 1").

2. STEP 2: STEP-BY-STEP IMPLEMENTATION
* The agent executes exactly ONE task at a time from the approved plan.
* After completing a task, the agent demonstrates the changes and waits for approval before moving on to the next step.

---

Before proposing a solution, always check your code for compliance with these 5 rules.