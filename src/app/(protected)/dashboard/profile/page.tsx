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

  // Fetch user data from database
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
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardLayout pageTitle="Profil Pengguna">
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
                {user.name || "Belum diatur"}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Username</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.username || "Belum diatur"}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.email}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Foto Profil</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user.image ? (
                  <div className="h-24 w-24 rounded-full overflow-hidden">
                    <img
                      src={user.image}
                      alt="Foto profil"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  "Belum diatur"
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Profile Image Form */}
      <ProfileImageForm />
    </DashboardLayout>
  );
};

export default ProfilePage;
