import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboardlayout";
import Head from "next/head";
import ProfileImageForm from "@/components/profile/profile-image-form";

const ProfilePage = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Check if the user is an employee
  const isEmployee = session.user.isEmployee === true;

  // Define the type for userData
  type UserData = {
    id: string;
    name: string | null;
    email: string | null;
    username: string | null;
    image: string | null;
    role: string;
    isEmployee: boolean;
    companyUsername?: string | null;
  };

  let userData: UserData | null = null;

  if (isEmployee) {
    // Fetch employee data from database
    const employee = await db.employee.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        employeeId: true,
        role: true,
        owner: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!employee) {
      redirect("/login");
    }

    // Format employee data to match user data structure
    userData = {
      id: employee.id,
      name: employee.name,
      email: null, // Employees don't have email in the current schema
      username: employee.employeeId,
      image: null, // Employees don't have images in the current schema
      role: employee.role,
      companyUsername: employee.owner.username,
      isEmployee: true,
    };
  } else {
    // Fetch regular user data from database
    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        image: true,
        role: true,
      },
    });

    if (!user) {
      redirect("/login");
    }

    userData = {
      ...user,
      isEmployee: false,
    };
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Profil Pengguna - Kasir Online</title>
      </Head>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Informasi Profil
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Detail informasi akun Anda
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Nama</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userData.name || "Belum diatur"}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Username</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userData.username || "Belum diatur"}
              </dd>
            </div>
            {userData.isEmployee ? (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Perusahaan
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userData.companyUsername || "Belum diatur"}
                </dd>
              </div>
            ) : (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userData.email || "Belum diatur"}
                </dd>
              </div>
            )}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {userData.role}
              </dd>
            </div>
            {!userData.isEmployee && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Foto Profil
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userData.image ? (
                    <div className="h-24 w-24 rounded-full overflow-hidden">
                      <img
                        src={userData.image}
                        alt="Foto profil"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    "Belum diatur"
                  )}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Profile Image Form - Only for regular users, not employees */}
      {!userData.isEmployee && <ProfileImageForm />}
    </DashboardLayout>
  );
};

export default ProfilePage;
